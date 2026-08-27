export const QUERY_KEYS = {
  auth: {
    all: ["auth"],
    me: () => [...QUERY_KEYS.auth.all, "me"],
  },
};
