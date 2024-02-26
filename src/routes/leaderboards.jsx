import * as React from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
// import SwipeableViews from 'react-swipeable-views';
import AppBar from '@mui/material/AppBar';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

import LeaderboardChart from './leaderboard/chart.jsx'
import LeaderboardScore from './leaderboard/score.jsx'


function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >      
      {value === index && (
        // <Box sx={{ p: 3 }}>
        //   <Typography>{children}</Typography>
        // </Box>
        <div>{children}</div>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const Leaderboards = () => {

  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ bgcolor: 'background.paper' }}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label=""
        >
          <Tab label="Most Played Charts" {...a11yProps(0)} />          
          <Tab label="Highest Player Accumulated Score" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} dir={theme.direction}>
        {<LeaderboardChart/>}
      </TabPanel>      
      <TabPanel value={value} index={1} dir={theme.direction}>
        {<LeaderboardScore/>}
      </TabPanel>     
    </Box>
  );  
};

export default Leaderboards;
