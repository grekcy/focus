import { unmountComponentAtNode } from "react-dom";

describe("InlineEdit", () => {
  let container: HTMLDivElement | null = null;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container!);
    container!.remove();
    container = null;
  });
});
