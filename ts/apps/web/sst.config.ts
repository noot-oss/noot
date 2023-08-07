import { SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";

export default {
  config(_input) {
    return {
      name: "noot",
      region: "eu-west-2",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, "site", {
        customDomain: {
          domainName: "noot.site",
          isExternalDomain: true,
          cdk: {
            certificate: Certificate.fromCertificateArn(
              stack,
              "nootWebSiteCertificate",
              process.env.WEB_SITE_AWS_ARN
            ),
          },
        },
        environment: {
          DATABASE_URL: process.env.DATABASE_URL,
          NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
          NEXTAUTH_URL: "https://noot.site",
          DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
          DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
          UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
          UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
