import { render, screen } from "@testing-library/react";
import MenuBar from "./App";

test("renders learn react link", () => {
  render(<MenuBar />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
