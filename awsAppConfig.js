import { writeFileSync } from "node:fs";

// ref: https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-code-samples-using-API-read-configuration.html

import {
  AppConfigDataClient,
  GetLatestConfigurationCommand,
  StartConfigurationSessionCommand,
} from "@aws-sdk/client-appconfigdata";

const appconfigdata = new AppConfigDataClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

const application_name = process.env.AWS_APP_CONFIG_APP_NAME;
const environment_name = process.env.AWS_APP_CONFIG_ENV_NAME;
const config_profile_name = process.env.AWS_APP_CONFIG_PROFILE_NAME;

const scs = await appconfigdata.send(
  new StartConfigurationSessionCommand({
    ApplicationIdentifier: application_name,
    EnvironmentIdentifier: environment_name,
    ConfigurationProfileIdentifier: config_profile_name,
  })
);
const { InitialConfigurationToken } = scs;

const glc = await appconfigdata.send(
  new GetLatestConfigurationCommand({
    ConfigurationToken: InitialConfigurationToken,
  })
);

const config = glc.Configuration.transformToString();

writeFileSync("./config.json", `${config}\n`);
