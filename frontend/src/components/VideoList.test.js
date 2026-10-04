import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { getAllVideos, updateWatchLaterVideo } from "../services/videoService";
import VideoList from "./VideoList";

jest.mock("../services/videoService", () => ({
  getAllVideos: jest.fn(),
  updateWatchLaterVideo: jest.fn(),
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
  updateWatchLaterVideo.mockResolvedValue({
    videoId: "video-1",
    watchLater: true,
  });
});

test("adds and removes a video from Watch later", async () => {
  render(<VideoList />);

  fireEvent.click(
    await screen.findByRole("button", {
      name: "More options for Intro to Science",
    }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Watch later" }));

  await waitFor(() => {
    expect(screen.getByRole("status")).toHaveTextContent(
      "Added to Watch later.",
    );
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
    expect(screen.getByRole("status")).toHaveTextContent(
      "Removed from Watch later.",
    );
    expect(window.localStorage.getItem("edutube.watchLater")).toBe("[]");
  });
});

test("shows remove from Watch later when the backend marks the video as saved", async () => {
  getAllVideos.mockResolvedValue([
    {
      videoId: "video-1",
      title: "Intro to Science",
      channelTitle: "Edu Channel",
      watchLater: true,
    },
  ]);

  render(<VideoList />);

  fireEvent.click(
    await screen.findByRole("button", {
      name: "More options for Intro to Science",
    }),
  );

  expect(
    screen.getByRole("button", { name: "Remove from Watch later" }),
  ).toBeInTheDocument();
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
