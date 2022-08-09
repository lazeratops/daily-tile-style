// **************************************** //
// *** FUNCTIONS TO DISPLAY VIDEO TILES *** //
// **************************************** //

import { DailyParticipant } from "@daily-co/daily-js";

// getContainer() returns the container DIV
// in which video tiles will be placed
function getContainer() {
  return document.getElementById("container");
}

// getVideoID() returns a standard string to
// be used as our video tile ID
function getVideoID(sessionID: string) {
  return `video-${sessionID}`;
}

// getMediaStream() takes a Daily participant
// and returns their audio and video tracks
// in a MediaStream instance
function getMediaStream(p: DailyParticipant) {
  const tracks = [];
  if (!p.local && p.audioTrack) {
    tracks.push(p.audioTrack);
  }
  if (p.videoTrack) {
    tracks.push(p.videoTrack);
  }
  return new MediaStream(tracks);
}

// addParticipantTile() adds a video element for the given
// Daily participant
export function addParticipantTile(p: DailyParticipant): HTMLVideoElement {
  let v = <HTMLVideoElement>document.getElementById(getVideoID(p.session_id));
  if (!v) {
    v = document.createElement("video");
  }
  v.id = getVideoID(p.session_id);
  v.autoplay = true;
  const stream = getMediaStream(p);
  v.srcObject = stream;
  const c = <HTMLDivElement>getContainer();
  c.appendChild(v);
  return v;
}

export function updateActiveSpeaker(
  newActiveSpeakerID: string | undefined,
  oldActiveSpeakerID: string | null
) {
  const a = "active";
  console.log("updating active spaker", newActiveSpeakerID, oldActiveSpeakerID);

  if (newActiveSpeakerID) {
    const newV = <HTMLVideoElement>(
      document.getElementById(getVideoID(newActiveSpeakerID))
    );
    if (newV) {
      newV.classList.add(a);
    }
  }
  if (oldActiveSpeakerID) {
    const oldV = <HTMLVideoElement>(
      document.getElementById(getVideoID(oldActiveSpeakerID))
    );
    if (oldV) {
      oldV.classList.remove(a);
    }
  }
}

// removeParticipantTile() removes a video element
// for the given Daily participant
export function removeParticipantTile(p: DailyParticipant) {
  const v = <HTMLVideoElement>document.getElementById(getVideoID(p.session_id));
  if (v) {
    v.remove();
  }
}

function updateVideoStyle(v: HTMLVideoElement, p: DailyParticipant) {
  console.log("updating video style", p.audio);
  if (p.audio) {
    v.classList.remove("mic-off");
    v.classList.add("mic-on");
    console.log("classlist: ", v.classList);
  } else {
    v.classList.remove("mic-on");
    v.classList.add("mic-off");
  }
}

// updateParticipantTile() updates a given participant's video tracks.
// Currently, it updates them unconditionally on any update,
// regardless of whether it is the tracks that triggered the event.
export function updateParticipantTile(p: DailyParticipant) {
  let v = <HTMLVideoElement>document.getElementById(getVideoID(p.session_id));
  if (!v) {
    v = addParticipantTile(p);
  } else {
    const stream = getMediaStream(p);
    v.srcObject = stream;
  }
  updateVideoStyle(v, p);
}
