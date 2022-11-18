import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false });

let count = 0;

export function start() {
  count++;
  NProgress.start();
}

export function done() {
  count--;
  if (count <= 0) {
    NProgress.done();
  }
}
