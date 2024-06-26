/* zoom out animation scaling with opacity */
const zoomOut = {
  0: {
    opacity: 0,
    scale: 0.3,
  },
  0.5: {
    opacity: 1,
    scale: 0.6,
  },
  1: {
    opacity: 1,
    scale: 1,
  },
};
/* zoom in and out animation scaling with opacity */
const zoomInOut = {
  0: {
    opacity: 0,
    scale: 1,
  },
  0.3: {
    opacity: 1,
    scale: 1.6,
  },
  0.6: {
    opacity: 1,
    scale: 1,
  },
  0.8: {
    opacity: 1,
    scale: 0.8,
  },
  1: {
    opacity: 1,
    scale: 1,
  },
};
/* opacity zero to one animation */
const opacityZoroToOne = {
  0: {
    opacity: 0,
  },
  1: {
    opacity: 1,
  },
}


const zoomInUp = {
  0: {
    opacity: 0.6,
    translateY: 200
  },
  0.5: {
    opacity: 1,
    translateY: 0
  },
  0.6: {
    opacity: 1,
    translateY: -10
  },
  0.8: {
    opacity: 1,
    translateY: -20
  },
  1: {
    opacity: 1,
    translateY: 0
  },
};

/* Exporting methods */
export { zoomOut, zoomInOut, opacityZoroToOne, zoomInUp }