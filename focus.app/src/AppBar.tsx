import MenuIcon from "@mui/icons-material/Menu";
import {
  Avatar,
  Box,
  IconButton,
  Input,
  SvgIcon,
  SvgIconProps,
  Toolbar,
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import { SyntheticEvent, useState } from "react";
import { v1alpha1Client } from "./lib/proto/FocusServiceClientPb";
import { Card } from "./lib/proto/focus_pb";

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
  onMenuClick?: () => void;
}

export function AppBar({ open, onMenuClick }: AppBarProps) {
  const [qucikAddSubject, setQucikAddSubject] = useState("");

  const onQuickAddKeyDown = async (e: SyntheticEvent) => {
    if ((e.nativeEvent as KeyboardEvent).key === "Enter") {
      console.log(`quick add: ${qucikAddSubject}`);

      const card = new Card();
      card.setSubject(qucikAddSubject);

      const svc = new v1alpha1Client("http://localhost:8080");
      await svc
        .quickAddCard(card, null)
        .then((r) => r.toObject())
        .catch((e) => console.log(e));

      setQucikAddSubject("");
    }
  };

  return (
    <MAppBar position="fixed" open={open}>
      <Toolbar>
        <IconButton
          color="inherit"
          onClick={() => onMenuClick && onMenuClick()}
          edge="start"
          sx={{ ...(open ? { display: "none" } : {}) }}
        >
          <MenuIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
        </IconButton>
        <Box sx={{ flexGrow: 1, display: { xs: "flex" } }}>
          <HomeIcon />
        </Box>
        <Box sx={{ flexGrow: 0, display: { xs: "flex" } }}>
          <Input
            sx={{ color: "inherit" }}
            id="quick-add"
            placeholder="add card to inbox..."
            value={qucikAddSubject}
            onChange={(e) => setQucikAddSubject(e.target.value)}
            onKeyDown={onQuickAddKeyDown}
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
