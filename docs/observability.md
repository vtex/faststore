# Observability

This projects uses OpenTelemetry to logs and traces. This logs and traces are sent to specific collectors defined in some environment variables.

## Logs

The log is exported to a collector URL defined by `OTLP_LOGGER_ENDPOINT` var defined [here](../packages/diagnostics/src/globals.ts). The variable is configured with the correct production variable. To log in development the following url should be used: `developer-logs.opentelemetry-collector.vtex.systems:80`

To see the generated logs one should go to the (grafana app)[https://grafana.vtex.com/explore] and search by attrs:
  - `vtex.account.name:required_logs_account_name` -> Example: `vtex.account.name:storeframework`
  - `vtex.application.id:faststore`

* Tip: The developer logs is queried at `victoria-logs-developer` and the production one at `victoria-logs-main`

## Traces

The traces are exported to a collector URL defined by `OTLP_TRACES_ENDPOINT` variable defined [here](../packages/diagnostics/src/globals.ts). The variable is configured with the correct production variable.

To see the traces collected we should connected to the vpn go to the (sgnoz app)[https://signoz-traces.vtex.systems/home] and search for
traces that contains the following attrs:
  - `@faststore_account_name: required_trace_account_name`
  - `@faststore_environment:production|development`


