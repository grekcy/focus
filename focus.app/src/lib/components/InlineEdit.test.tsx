import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { InlineEdit } from "./InlineEdit";

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

  test("escape", () => {
    act(() => {
      render(<InlineEdit value="hello world" />, container);
    });
  });
});
