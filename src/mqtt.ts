import mqtt, { MqttClient } from "mqtt";

export class Mqtt {
  public client: MqttClient | null = null;

  async connect() {
    this.client = await mqtt.connectAsync(process.env.MQTT_URL!);
  }

  async publish(topic: string, message: string) {
    if (!this.client) {
      await this.connect();
    }
    await this.client?.publishAsync(topic, message);
  }
}
