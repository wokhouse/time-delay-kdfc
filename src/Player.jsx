import React, { Component } from 'react';

const getAvaliableRecordings = async () => {
  const res = await fetch('http://localhost:4000/avaliable-recordings');
  const avaliableRecordings = await res.json();
  return avaliableRecordings;
}

const getNextTrack = ({ recordings, localTime }) => {
  const { files, data } = recordings;
  const comparisons = files.map((f) => {
    const greaterThanLocal = new Date(data[f].startTime) > localTime
    return {f, greaterThanLocal};
  });
  // find the track matches local time
  const getCurrentTrack = (i = 0) => {
    // if this track does not match local time, recursively check the next one
    if (!comparisons[i].greaterThanLocal) return getCurrentTrack(i + 1)
    // when we find the track after the one that matches local time, return the track before
    return data[comparisons[i - 1].f]
  }
  const currentTrack = getCurrentTrack();
  return currentTrack
};

class Player extends Component {
  constructor(props) {
    super(props);

    const startTime = 1586713183782;
    this.state = {
      // TODO: remove testing timestamp
      startTime,
      localTime: new Date(startTime),
      audio: {},
      loading: false,
    };

    this.handlePlay = this.handlePlay.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.clock = this.clock.bind(this);
  }
  
  clock () {
    const { startTime } = this.state;
    this.setState({ startTime: startTime + 1000, localTime: new Date(startTime + 1000) })
  }

  componentDidMount() {
    this.clock();
    setInterval(this.clock, 1000); 
  }

  async handlePlay (e) {
    // get all avaliable recordings from server
    const recordings = await getAvaliableRecordings();
    // grab local time from state
    const { localTime } = this.state;
    // find the filename of the recording we are on right now
    const { filename, startTime } = getNextTrack({ recordings, localTime });
    // see how far into the file we are, use as start time
    const diff = ( new Date(localTime).getTime() - new Date(startTime).getTime() ) / 1000;
    // get that file, start playinh
    const trackURL = `http://localhost:4000/recording/${filename}#t=${diff}`;
    const audio = new Audio(trackURL);
    audio.play();
    this.setState({ audio, loading: true });
    audio.addEventListener('play', () => this.setState({ loading: false }));
  }

  handlePause (e) {
    this.state.audio.pause();
  }

  render() {
    return(
      <div>
        <div>
          local time: {new Date(this.state.localTime).toTimeString()}
        </div>
        <div className="mt-2">
          <button className="btn btn-primary" disabled={ (this.state.loading) ? true : false } onClick={this.handlePlay}>Play</button>
          <button className="btn btn-success ml-1" onClick={this.handlePause}>Pause</button>
        </div>
      </div>
    );
  }
}

export default Player;
