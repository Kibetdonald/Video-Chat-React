//react hooks
import { useState, useRef } from "react";
// useClient function from settings.js file
import { useClient } from "./settings";
// Material UI Grid
import { Grid, Button } from "@material-ui/core";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
// react icons video Share
import { MdOutlineScreenShare } from "react-icons/md";

export default function Controls(props) {
  // client object
  const client = useClient();
  // stream object
  const userStream = useRef();
  // Array of senders
  const senders = useRef([]);
  const { tracks, setStart, setInCall } = props;
  // Use state function for muting and turning of the video
  const [trackState, setTrackState] = useState({ video: true, audio: true });

  // Mute Video and Audio function
  const mute = async (type) => {
    if (type === "audio") {
      await tracks[0].setEnabled(!trackState.audio);
      // Toggles the audio on and off
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === "video") {
      await tracks[1].setEnabled(!trackState.video);
      // Toggles the video on and off
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    }
  };

  // Function to leave the channel
  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    // Closes the audio track
    tracks[0].close();
    // Closes the video track
    tracks[1].close();
    setStart(false);
    setInCall(false);
  };

  // Function to share the channel
  function shareScreen() {
    navigator.mediaDevices.getDisplayMedia({ cursor: true }).then((stream) => {
      const screenTrack = stream.getTracks()[0];
      senders.current
        .find((sender) => sender.track.kind === "video")
        .replaceTrack(screenTrack);
      screenTrack.onended = function () {
        senders.current
          .find((sender) => sender.track.kind === "video")
          .replaceTrack(userStream.current.getTracks()[0]);
        // senders.replaceTrack(videoTrack);
        senders.getTracks([0]);
        // tracks[1].replaceTrack()
      };
    });
  }

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item>
        <Button
          variant="contained"
          color={trackState.audio ? "primary" : "secondary"}
          onClick={() => mute("audio")}
        >
          {trackState.audio ? <MicIcon /> : <MicOffIcon />}
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color={trackState.video ? "primary" : "secondary"}
          onClick={() => mute("video")}
        >
          {trackState.video ? <VideocamIcon /> : <VideocamOffIcon />}
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="default"
          onClick={() => shareScreen()}
        >
          {/* Share Screen */}
          <MdOutlineScreenShare style={{ fontSize: "25px" }} />
        </Button>
      </Grid>

      <Grid item>
        <Button
          variant="contained"
          color="default"
          onClick={() => leaveChannel()}
        >
          Leave
          <ExitToAppIcon />
        </Button>
      </Grid>
    </Grid>
  );
}
