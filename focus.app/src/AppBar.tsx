import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  ListItemButton,
  SvgIcon,
  SvgIconProps,
  TextField,
  Toolbar,
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import { SyntheticEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useFocusApp, useFocusClient } from "./FocusProvider";

const drawerWidth = 170;

interface MAppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const MAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<MAppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

interface AppBarProps {
  open: boolean;
}

export function AppBar({ open }: AppBarProps) {
  const [qucikAddSubject, setQucikAddSubject] = useState("");
  const [adding, setAdding] = useState(false);

  const app = useFocusApp();
  const api = useFocusClient();

  const onQuickAddKeyUp = (e: SyntheticEvent) => {
    if ((e.nativeEvent as KeyboardEvent).key === "Enter") {
      if (adding) return; // NOTE 한글의 경우 글을 조합하는 도중에 Enter를 누르면 2번 호출됨
      const subject = qucikAddSubject.trim();
      if (subject === "") return;

      setAdding(true);

      (async () => {
        api
          .quickAddCard(subject)
          .then((r) => {
            setQucikAddSubject("");
            return r;
          })
          .catch((e) => app.toast(e.message, "error"))
          .finally(() => setAdding(false));
      })();
    }
  };

  return (
    <MAppBar position="fixed" open={open}>
      <Toolbar>
        <IconButton
          color="inherit"
          onClick={() => app.toggleSidebar()}
          edge="start"
          sx={{ ...(open ? { display: "none" } : {}) }}
        >
          <MenuIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
        </IconButton>
        <Box sx={{ flexGrow: 0, display: { xs: "flex" } }}>
          <ListItemButton component={Link} to="/">
            <HomeIcon />
          </ListItemButton>
        </Box>
        <Box sx={{ flexGrow: 1, display: { xs: "flex" } }} />
        <Box sx={{ flexGrow: 0, display: { xs: "flex" } }}>
          <TextField
            variant="standard"
            placeholder="add card to inbox..."
            value={qucikAddSubject}
            onChange={(e) => setQucikAddSubject(e.target.value)}
            onKeyUp={onQuickAddKeyUp}
            InputProps={{
              sx: { color: "inherit" },
              startAdornment: (
                <InputAdornment position="start">
                  <AddIcon sx={{ color: "white" }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box sx={{ flexGrow: 0 }}>
          <IconButton>
            <Avatar />
          </IconButton>
        </Box>
      </Toolbar>
    </MAppBar>
  );
}

function HomeIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}
