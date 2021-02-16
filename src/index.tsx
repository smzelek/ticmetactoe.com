import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./components/App";

ReactDOM.render(<App lang="TypeScript" />,
    document.getElementById('root')
);

// if (navigator.serviceWorker) {
//     navigator.serviceWorker.register('sw.js')
// }
