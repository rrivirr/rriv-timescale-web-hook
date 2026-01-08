import pg from "pg";
import mqtt from "mqtt";

class BigIntWrapper {
  private value: bigint;
  constructor(value: bigint) {
    this.value = value;
  }
  toJSON() {
    return this.value.toString() + "n";
  }
}

export const insert = async (body: any) => {
  try {
    const {
      time,
      deviceInfo: { devEui },
      data,
    } = body;

    console.log("time", time, "devEui", devEui, "data", data);

    const dataDecoded = Buffer.from(data, "base64");
    let values: { [key: string]: any } = {};
    // decode from naive codec
    const timestamp = dataDecoded.readBigUInt64BE(0);

    values["timestamp"] = new BigIntWrapper(timestamp);

    let j = 1;
    for (let i = 8; i < 20; i = i + 4) {
      const value = dataDecoded.readInt32BE(i) / 100;
      values["value_" + j] = value;
      j = j + 1;
    }

    const json = JSON.stringify(values);

    const client = new pg.Client(process.env.DATABASE_URL);

    await client.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `
        INSERT INTO events
          ( time, eui, data, values )
        VALUES
          ( $1, $2, $3, $4 )
        `,
        [time, devEui, data, json]
      );
      const mqttClient = await mqtt.connectAsync(process.env.MQTT_URL!);
      await mqttClient.publishAsync(`/data/raw/${devEui}`, json);
      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    }

    await client.end();
  } catch (e) {
    console.log("body", body);
    throw e;
  }
};
