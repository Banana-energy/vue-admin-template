interface Env {
  baseUrl: string;
}

const env: Env = {
  baseUrl: import.meta.env.DEV ? "https://mirmiles.usemock.com" : "",
};

export default env;
