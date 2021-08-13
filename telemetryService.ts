import * as appInsights from 'applicationinsights';
import { TelemetryClient } from 'applicationinsights';
import { ApplicationInsights } from '@microsoft/applicationinsights-web'

export class TelemetryService {
  private isInitialized = false;
  private serverSideTelemetry? : TelemetryClient;
  private clientSideTelemetry? : ApplicationInsights;

  constructor() {
    this.initializeTelemetry();
  }

  private isRunningServerSide: () => boolean = () => {
    return typeof window === 'undefined';
  };

  private initializeTelemetry() {
    if (this.isInitialized) {
      console.log("Already initialized")
      return;
    }

    if (this.isRunningServerSide()) {
      console.log("Initializing server side telemetry");

      appInsights
        .setup("e466cf8b-f747-421f-814f-a90010e22df1")
        .setAutoDependencyCorrelation(false)
        .setAutoCollectRequests(false)
        .setAutoCollectPerformance(false, false)
        .setAutoCollectExceptions(false)
        .setAutoCollectDependencies(false)
        .setAutoCollectConsole(false)
        .setAutoCollectHeartbeat(false)
        .setUseDiskRetryCaching(false)
        .setSendLiveMetrics(false)
        .setDistributedTracingMode(appInsights.DistributedTracingModes.AI)
        .start();

      this.serverSideTelemetry = appInsights.defaultClient;
    }
    else {
      console.log("Initializing client side telemetry");

      this.clientSideTelemetry = new ApplicationInsights({ config: {
        instrumentationKey: "e466cf8b-f747-421f-814f-a90010e22df1"
      } });
  
      this.clientSideTelemetry.loadAppInsights();
    }
  }

  public Log(message: string) {
    if (this.isRunningServerSide()) {
      console.log(`Logging with server side client - is undefined: ${this.serverSideTelemetry === undefined} - message: ${message}`);
      this.serverSideTelemetry?.trackEvent({name: message, properties: {customProperty: "custom property value"}});
    } else {
      console.log(`Logging with client side client - is undefined: ${this.clientSideTelemetry === undefined} - message: ${message}`);
      this.clientSideTelemetry?.trackEvent({name: message, properties: {customProperty: "custom property value"}});
    }
  }
}

export const telemetryService = new TelemetryService();