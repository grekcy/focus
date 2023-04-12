import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AddIcon from "@mui/icons-material/Add";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  AppBar as MuiAppBar,
  AppBarProps as MuiAppBarProps,
  SvgIcon,
  SvgIconProps,
  TextField,
  Toolbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { MouseEvent, SyntheticEvent, useEffect, useRef, useState } from "react";
import { Cookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import { useFocusApp, useFocusClient } from "./FocusProvider";
import { useAction } from "./lib/components/Action";
import { User } from "./lib/proto/focus_v1alpha1_pb";
import { newGuestUser } from "./lib/proto/helper";

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
  const [qucikAddObjective, setQucikAddObjective] = useState("");
  const [adding, setAdding] = useState(false);

  const app = useFocusApp();
  const api = useFocusClient();

  function onQuickAddKeyUp(e: SyntheticEvent) {
    if ((e.nativeEvent as KeyboardEvent).key === "Enter") {
      if (adding) return; // NOTE 한글의 경우 글을 조합하는 도중에 Enter를 누르면 2번 호출됨
      const objective = qucikAddObjective.trim();
      if (objective === "") return;

      setAdding(true);

      api
        .addCard(objective)
        .then((r) => {
          setQucikAddObjective("");
          app.toast(`added: ${objective} as ${r.cardNo}`, "success");
        })
        .catch((e) => app.toast(e.message, "error"))
        .finally(() => setAdding(false));
    }
  }

  useAction({
    label: "Quick add card",
    hotkey: "⌘+Ctrl+A",
    onExecute: () => ref.current && ref.current.focus(),
  });

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  function handleOpenUserMenu(event: MouseEvent<HTMLElement>): void {
    setAnchorElUser(event.currentTarget);
  }

  const [currentUser, setCurrentUser] = useState<User.AsObject>(newGuestUser());
  useEffect(() => {
    if (api.isLogined()) {
      api
        .getProfile()
        .then((r) => setCurrentUser(r))
        .catch((e) => app.toast(e.message, "error"));
    } else {
      setCurrentUser(newGuestUser());
    }
  }, [api]);

  const cookies = new Cookies();

  const navigate = useNavigate();
  function handleLogout() {
    setAnchorElUser(null);

    cookies.remove("focus-token");
    api.setLogin("");

    navigate("/");
  }

  const ref = useRef<HTMLDivElement>(null);

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
            inputRef={ref}
            variant="standard"
            placeholder="add card to inbox... ⌘+Ctrl+A"
            value={qucikAddObjective}
            onChange={(e) => setQucikAddObjective(e.target.value)}
            onKeyUp={onQuickAddKeyUp}
            InputProps={{
              sx: { color: "inherit" },
              startAdornment: (
                <InputAdornment position="start">
                  <AddIcon sx={{ color: "white" }} />
                </InputAdornment>
              ),
            }}
            sx={{ width: { md: 300 } }}
          />
        </Box>
        <Box sx={{ flexGrow: 0 }}>
          <IconButton onClick={handleOpenUserMenu}>
            <Avatar />
          </IconButton>
          <Menu
            anchorEl={anchorElUser}
            open={!!anchorElUser}
            onClose={() => setAnchorElUser(null)}
          >
            {api.isLogined() && (
              <>
                <MenuItem
                  component={Link}
                  to="/account"
                  onClick={() => setAnchorElUser(null)}
                >
                  <ListItemIcon>
                    <AccountBoxIcon />
                  </ListItemIcon>
                  <ListItemText>{currentUser.name} - Profile</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => handleLogout()}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </MenuItem>
              </>
            )}
            {!api.isLogined() && (
              <>
                <MenuItem
                  component={Link}
                  to="/auth/login"
                  onClick={() => setAnchorElUser(null)}
                >
                  <ListItemIcon>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText primary="Login" />
                </MenuItem>
              </>
            )}
          </Menu>
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
