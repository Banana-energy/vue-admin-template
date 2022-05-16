interface Env {
  baseUrl: string;
}

const env: Env = {
  baseUrl: import.meta.env.DEV ? "/app" : "",
};

export default env;
