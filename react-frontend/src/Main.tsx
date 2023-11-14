import { MantineProvider} from '@mantine/core';
import '@mantine/core/styles.css';
import App from './App';
import {theme} from './theme';

interface MainProps {
  currentView: string;
}
function Main(props: MainProps) {
  return (
    <MantineProvider theme={theme}>
    <App currentView={props.currentView}/>
    </MantineProvider>
  );
}

export default Main;
