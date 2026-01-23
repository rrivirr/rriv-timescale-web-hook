import knex from "./knex.ts";
import type { Mqtt } from "./mqtt.ts";

class BigIntWrapper {
  private value: bigint;
  constructor(value: bigint) {
    this.value = value;
  }
  toJSON() {
    return this.value.toString() + "n";
  }
}

export const insert = async (body: any, mqtt: Mqtt) => {
  try {
    const {
      time,
      deviceInfo: { devEui },
      data,
    } = body;

    console.log("time", time, "devEui", devEui, "data", data);

    const dataDecoded = Buffer.from(data, "base64");
    let length = dataDecoded.length;
    let values: { [key: string]: any } = {};
    // decode from naive codec
    const timestamp = dataDecoded.readBigUInt64BE(0);
    length = length - 8; // remove the length portion from the timestamp

    values["timestamp"] = new BigIntWrapper(timestamp);

    let j = 1;
    for (let i = 0; i < length; i = i + 2) {
      const value = dataDecoded.readInt16BE(i) / 100;
      values["value_" + j] = value;
      j = j + 1;
    }

    const json = JSON.stringify(values);

    await knex.transaction(async (trx) => {
      await trx.raw(
        `
        INSERT INTO events
          ( time, eui, data, values )
        VALUES
          ( ?, ?, ?, ? )
        `,
        [time, devEui, data, json],
      );
      await mqtt.publish(`/data/raw/${devEui}`, json);
    });
  } catch (e) {
    console.log("body", body);
    throw e;
  }
};
