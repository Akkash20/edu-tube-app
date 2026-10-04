import React, { useEffect, useState } from "react";
import { getAllVideos, updateWatchLaterVideo } from "../services/videoService";
import {
  MoreOptionsIcon,
  NotInterestedIcon,
  ShareIcon,
  WatchLaterIcon,
} from "./icons";
import "./VideoList.css";

const WATCH_LATER_STORAGE_KEY = "edutube.watchLater";
const VIDEO_MENU_HEIGHT = 150;
const BOTTOM_NAV_CLEARANCE = 80;

function getSavedVideoIds() {
  try {
    const savedIds = JSON.parse(
      window.localStorage.getItem(WATCH_LATER_STORAGE_KEY) || "[]",
    );
    return Array.isArray(savedIds) ? savedIds : [];
  } catch {
    return [];
  }
}

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [watchLaterIds, setWatchLaterIds] = useState(getSavedVideoIds);
  const [hiddenVideoIds, setHiddenVideoIds] = useState([]);
  const [openMenuVideoId, setOpenMenuVideoId] = useState(null);
  const [openMenuPlacement, setOpenMenuPlacement] = useState("below");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message) => {
    setToastMessage(message);
  };

  useEffect(() => {
    getAllVideos()
      .then((fetchedVideos) => {
        setVideos(fetchedVideos);

        const savedVideoIds = fetchedVideos
          .filter((video) => video.watchLater === true)
          .map((video) => video.videoId);

        if (savedVideoIds.length > 0) {
          setWatchLaterIds((currentIds) => {
            const uniqueIds = new Set([...currentIds, ...savedVideoIds]);
            return Array.from(uniqueIds);
          });
        }
      })
      .catch((err) => console.error("Error fetching videos:", err));
  }, []);

  useEffect(() => {
    if (!toastMessage) return undefined;

    const timerId = window.setTimeout(() => {
      setToastMessage("");
    }, 2200);

    return () => window.clearTimeout(timerId);
  }, [toastMessage]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        WATCH_LATER_STORAGE_KEY,
        JSON.stringify(watchLaterIds),
      );
    } catch {
      showToast("Watch later could not be saved in this browser.");
    }
  }, [watchLaterIds]);

  useEffect(() => {
    if (!openMenuVideoId) return undefined;

    const closeMenuOnOutsideClick = (event) => {
      if (!event.target.closest(".video-actions")) {
        setOpenMenuVideoId(null);
      }
    };

    document.addEventListener("pointerdown", closeMenuOnOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", closeMenuOnOutsideClick);
  }, [openMenuVideoId]);

  const toggleWatchLater = async (video) => {
    const isSaved =
      Boolean(video.watchLater) || watchLaterIds.includes(video.videoId);
    const nextWatchLaterValue = !isSaved;

    try {
      await updateWatchLaterVideo(video.videoId, nextWatchLaterValue);

      setVideos((currentVideos) =>
        currentVideos.map((item) =>
          item.videoId === video.videoId
            ? { ...item, watchLater: nextWatchLaterValue }
            : item,
        ),
      );

      setWatchLaterIds((currentIds) =>
        nextWatchLaterValue
          ? [...currentIds, video.videoId]
          : currentIds.filter((id) => id !== video.videoId),
      );
      showToast(
        nextWatchLaterValue
          ? "Added to Watch later."
          : "Removed from Watch later.",
      );
    } catch (error) {
      console.error("Error updating watch later:", error);
      showToast("Could not update Watch later.");
    }

    setOpenMenuVideoId(null);
  };

  const shareVideo = async (video) => {
    const url = `https://www.youtube.com/watch?v=${video.videoId}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: video.title, url });
        showToast("Video shared.");
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        showToast("Video link copied.");
      } else {
        showToast("Sharing is not available in this browser.");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        showToast("Could not share this video.");
      }
    }

    setOpenMenuVideoId(null);
  };

  const hideVideo = (video) => {
    setHiddenVideoIds((currentIds) => [...currentIds, video.videoId]);
    showToast("Video removed from your feed.");
    setOpenMenuVideoId(null);
  };

  return (
    <div className="container">
      <h2 className="header">🎓 Educational Video Feed</h2>
      {toastMessage && (
        <div className="video-toast" role="status" aria-live="polite">
          {toastMessage}
        </div>
      )}
      <div className="grid">
        {videos
          .filter((video) => !hiddenVideoIds.includes(video.videoId))
          .map((video) => {
            const isSaved =
              Boolean(video.watchLater) ||
              watchLaterIds.includes(video.videoId);
            const isMenuOpen = openMenuVideoId === video.videoId;

            return (
              <div className="card" key={video.videoId}>
                <div className="player-wrapper">
                  {playingVideoId === video.videoId ? (
                    <iframe
                      title={video.title}
                      src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&playsinline=1&rel=0`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  ) : (
                    <button
                      className="thumbnail-button"
                      type="button"
                      onClick={() => setPlayingVideoId(video.videoId)}
                      aria-label={`Play ${video.title}`}
                    >
                      <img
                        className="thumbnail-image"
                        src={
                          video.thumbnail ||
                          `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`
                        }
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="play-button" aria-hidden="true" />
                    </button>
                  )}
                </div>
                <div className="card-content">
                  <div className="video-title-row">
                    <h4 className="title">{video.title}</h4>
                    <div className="video-actions">
                      <button
                        className="video-options-button"
                        type="button"
                        aria-label={`More options for ${video.title}`}
                        aria-expanded={isMenuOpen}
                        aria-controls={`video-options-${video.videoId}`}
                        onClick={(event) => {
                          if (isMenuOpen) {
                            setOpenMenuVideoId(null);
                            return;
                          }

                          const buttonBottom =
                            event.currentTarget.getBoundingClientRect().bottom;
                          const roomBelow =
                            window.innerHeight -
                            buttonBottom -
                            BOTTOM_NAV_CLEARANCE;

                          setOpenMenuPlacement(
                            roomBelow < VIDEO_MENU_HEIGHT ? "above" : "below",
                          );
                          setOpenMenuVideoId(video.videoId);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Escape") setOpenMenuVideoId(null);
                        }}
                      >
                        <MoreOptionsIcon />
                      </button>
                      {isMenuOpen && (
                        <div
                          className={`video-options-menu${
                            openMenuPlacement === "above" ? " is-above" : ""
                          }`}
                          id={`video-options-${video.videoId}`}
                          aria-label={`Options for ${video.title}`}
                        >
                          <button
                            className="video-action"
                            type="button"
                            onClick={() => toggleWatchLater(video)}
                          >
                            <WatchLaterIcon />
                            <span>
                              {isSaved
                                ? "Remove from Watch later"
                                : "Watch later"}
                            </span>
                          </button>
                          <button
                            className="video-action"
                            type="button"
                            onClick={() => shareVideo(video)}
                          >
                            <ShareIcon />
                            <span>Share</span>
                          </button>
                          <button
                            className="video-action"
                            type="button"
                            onClick={() => hideVideo(video)}
                          >
                            <NotInterestedIcon />
                            <span>Not interested</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="channel">{video.channelTitle}</p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default VideoList;
