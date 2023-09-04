import React from "react";
import { api } from "~web/utils/api";

export const TrpcProvider = api.withTRPC(
  (props: React.PropsWithChildren) => props.children
) as React.ComponentType<React.PropsWithChildren>;
