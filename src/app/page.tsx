"use client";

import { Box, Button, Paper, Typography } from "@mui/material";
import React, { useLayoutEffect, useRef } from "react";
import styles from "./page.module.css";
import RINGS from "vanta/dist/vanta.rings.min.js";
import * as THREE from "three";

// class ExampleApp extends React.Component {
//   constructor(props: any) {
//     super(props)
//     this.vantaRef = React.createRef()
//   }
//   componentDidMount() {
//     this.
//   }
//   componentWillUnmount() {
//     if (this.vantaEffect) this.vantaEffect.destroy()
//   }
//   render() {
//     return <div className='vanta' ref={this.vantaRef}>
//       <span> Foreground content goes here </span>
//     </div>
//   }
// }

const Home = () => {
  const vantaRef = useRef<any>(null);
  const vantaEffect = useRef<any>(null);

  useLayoutEffect(() => {
    vantaEffect.current = RINGS({
      el: vantaRef.current,
      THREE: THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.0,
      minWidth: 200.0,
      scale: 1.0,
      scaleMobile: 1.0,
    });

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, []);

  return (
    <Box ref={vantaRef} className={styles.container}>
      <Paper className={styles.paper} elevation={3}>
        <Typography variant="h4">Data Flow Tool</Typography>
        <Typography variant="h6" color="text.secondary">
          Get Started
        </Typography>
        <Button
          className={styles.button}
          variant="outlined"
          color="success"
          size="large"
        >
          New flow
        </Button>
      </Paper>
    </Box>
  );
};

export default Home;
