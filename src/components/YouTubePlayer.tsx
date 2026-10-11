"use client";

import { useState } from "react";
import Image from "next/image";
import { getYouTubeId } from "@/data/work";

export function YouTubePlayer({
  url,
  title,
  poster,
}: {
  url: string;
  title: string;
  poster?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const id = getYouTubeId(url);
  if (!id) return null;
  return (
    <div className="video-player">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        <button
          type="button"
          className="video-play-button"
          onClick={() => setPlaying(true)}
        >
          {poster && (
            <Image
              className="video-poster"
              src={poster}
              alt=""
              fill
              sizes="(max-width: 767px) 90vw, 850px"
            />
          )}
          <span className="play-symbol" aria-hidden="true">
            &#9654;
          </span>
          <span>Play {title}</span>
          <small>Loads YouTube when you press play</small>
        </button>
      )}
    </div>
  );
}
