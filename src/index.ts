import "./styles.css";
import {
  setupJoinForm,
  setupToggleCam,
  setupToggleMic,
  updateCamLabel,
  updateMicLabel
} from "./nav";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";
import {
  addParticipantTile,
  updateParticipantTile,
  removeParticipantTile,
  updateActiveSpeaker
} from "./tiles";

type State = {
  video: boolean | null;
  audio: boolean | null;
  currentActiveSpeakerID: string | null;
};
let call: DailyCall;
const localState: State = {
  video: null,
  audio: null,
  currentActiveSpeakerID: null
};
const errNotInCall = "must be in a call";

export default function join(roomURL: string) {
  // Set up Daily call object

  call = DailyIframe.createCallObject({
    url: roomURL,
    dailyConfig: {
      // We know we'll want small tiles, so go ahead and
      // set some relevant getUserMedia() constraints
      userMediaVideoConstraints: {
        width: 150,
        height: 150
      },
      camSimulcastEncodings: [{ maxBitrate: 600000, maxFramerate: 30 }]
    }
  });

  // Set up event handlers
  call
    .on("joined-meeting", (e) => {
      setupToggleMic(() => {
        if (!call) {
          console.error(errNotInCall);
          return;
        }
        call.setLocalAudio(!localState.audio);
      });

      setupToggleCam(() => {
        if (!call) {
          console.error(errNotInCall);
          return;
        }
        call.setLocalVideo(!localState.video);
      });

      const p = e?.participants?.local;
      if (!p) return;
      addParticipantTile(p);
    })
    .on("participant-updated", (e) => {
      const p = e?.participant;
      if (!p) return;
      updateParticipantTile(p);
      if (!p.local) return;
      localState.audio = p.audio;
      localState.video = p.video;
      updateMicLabel(localState.audio);
      updateCamLabel(localState.video);
    })
    .on("participant-joined", (e) => {
      const p = e?.participant;
      if (!p) return;
      addParticipantTile(p);
    })
    .on("participant-left", (e) => {
      const p = e?.participant;
      if (!p) return;
      removeParticipantTile(p);
    })
    .on("active-speaker-change", (e) => {
      console.log("active speaker fired", e);
      updateActiveSpeaker(
        e?.activeSpeaker.peerId,
        localState.currentActiveSpeakerID
      );
    });

  // Join the call
  try {
    call.join({
      userName: "It's me, Mario"
    });
  } catch (e) {
    console.error("failed to join meeting", e);
  }
}

setupJoinForm(join);
