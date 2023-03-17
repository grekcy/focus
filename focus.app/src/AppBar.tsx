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
  const [adding, setAdding] = useState(false);

  const onQuickAddKeyUp = (e: SyntheticEvent) => {
    if ((e.nativeEvent as KeyboardEvent).key === "Enter") {
      if (adding) return; // NOTE 한글의 경우 글을 조합하는 도중에 Enter를 누르면 2번 호출됨
      const subject = qucikAddSubject.trim();
      if (subject === "") return;

      setAdding(true);

      const card = new Card();
      card.setSubject(subject);

      // TODO 주소를 이렇게 넣었는데, 이러면 안되지
      const svc = new v1alpha1Client("http://localhost:8080");
      (async () => {
        svc
          .quickAddCard(card, null)
          .then((r) => r.toObject())
          .then((r) => {
            setQucikAddSubject("");
            return r;
          })
          .catch((e) => e)
          .finally(() => setAdding(false));
      })();
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
            onKeyUp={onQuickAddKeyUp}
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
