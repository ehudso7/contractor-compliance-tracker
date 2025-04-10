import React from "react"; // ← add this line
import { render, screen } from "@testing-library/react";
import HomePage from "@/app/page";

test("renders homepage heading", () => {
  render(<HomePage />);
  expect(screen.getByText(/welcome to command my startup/i)).toBeInTheDocument();
});
