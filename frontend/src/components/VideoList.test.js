import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { getAllVideos } from "../services/videoService";
import VideoList from "./VideoList";

jest.mock("../services/videoService", () => ({
  getAllVideos: jest.fn(),
}));

beforeEach(() => {
  window.localStorage.clear();
  getAllVideos.mockResolvedValue([
    {
      videoId: "video-1",
      title: "Intro to Science",
      channelTitle: "Edu Channel",
    },
  ]);
});

test("adds and removes a video from Watch later", async () => {
  render(<VideoList />);

  fireEvent.click(
    await screen.findByRole("button", {
      name: "More options for Intro to Science",
    }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Watch later" }));

  expect(screen.getByRole("status")).toHaveTextContent("Added to Watch later.");
  await waitFor(() => {
    expect(window.localStorage.getItem("edutube.watchLater")).toBe(
      '["video-1"]',
    );
  });

  fireEvent.click(
    screen.getByRole("button", {
      name: "More options for Intro to Science",
    }),
  );
  fireEvent.click(
    screen.getByRole("button", { name: "Remove from Watch later" }),
  );

  await waitFor(() => {
    expect(window.localStorage.getItem("edutube.watchLater")).toBe("[]");
  });
});

test("opens the options menu upward when there is not enough room below", async () => {
  render(<VideoList />);

  const optionsButton = await screen.findByRole("button", {
    name: "More options for Intro to Science",
  });
  Object.defineProperty(optionsButton, "getBoundingClientRect", {
    value: () => ({ bottom: window.innerHeight - 20 }),
  });

  fireEvent.click(optionsButton);

  expect(document.querySelector(".video-options-menu")).toHaveClass("is-above");
});
