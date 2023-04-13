import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CalendarViewWeekIcon from "@mui/icons-material/CalendarViewWeek";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import FlagIcon from "@mui/icons-material/Flag";
import InboxIcon from "@mui/icons-material/Inbox";
import InsightsIcon from "@mui/icons-material/Insights";
import LabelIcon from "@mui/icons-material/Label";
import MicrowaveIcon from "@mui/icons-material/Microwave";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer as MuiDrawer,
  Tooltip,
} from "@mui/material";
import { CSSObject, Theme, styled } from "@mui/material/styles";
import {
  Ref,
  SyntheticEvent,
  createElement,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { useFocusApp } from "../lib/components/FocusProvider";

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const drawerWidth = 170;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

interface SideBarProps {
  open?: boolean;
}

export interface ISideBar {
  toggle: () => void;
}

const pages = [
  {
    href: "/inbox",
    title: "Inbox",
    icon: InboxIcon,
    tooltip: "inbox",
  },
  {
    href: "/today",
    title: "Today",
    icon: CalendarTodayIcon,
    tooltip: "focus today",
  },
  {
    href: "/forecast",
    title: "Forecast",
    icon: CalendarViewWeekIcon,
    tooltip: "forecast",
  },
  { title: "-" },
  {
    href: "/challenges/",
    title: "Challenges",
    icon: ViewColumnIcon,
    tooltip: "Challenge",
  },
  { title: "-" },
  {
    href: "/planning",
    title: "Planning",
    icon: FlagIcon,
    tooltip: "planning",
  },
  {
    href: "/performance",
    title: "Performance",
    icon: InsightsIcon,
    tooltip: "performance",
  },
  { title: "-" },
  {
    href: "/labels",
    title: "Labels",
    icon: LabelIcon,
    tooltip: "Labels",
  },
];

if (process.env.REACT_APP_ENV === "development") {
  pages.push(
    { title: "-" },
    {
      href: "/playground/",
      title: "Playground",
      icon: MicrowaveIcon,
      tooltip: "Playground",
    }
  );
}

export const SideBar = forwardRef(
  ({ open }: SideBarProps, ref: Ref<ISideBar>) => {
    useImperativeHandle(ref, () => ({
      toggle() {
        setCurrentOpen((p) => !p);
      },
    }));

    const [currentOpen, setCurrentOpen] = useState(open);
    useEffect(() => {
      setCurrentOpen(open);
    }, [open]);

    const app = useFocusApp();

    return (
      <Box>
        <Drawer variant="permanent" open={currentOpen} onClose={toggleDrawer}>
          <DrawerHeader>
            <IconButton key="x" onClick={() => app.toggleSidebar()}>
              <ChevronLeftIcon />
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            {pages.map((page, i) => {
              if (page.title === "-") {
                return <Divider key={`${page.title}${i}`} />;
              }

              const icon = createElement(page.icon!);
              return (
                <ListItem
                  disablePadding
                  sx={{ display: "block" }}
                  key={page.title}
                >
                  <Tooltip title={page.tooltip!}>
                    <ListItemButton
                      dense
                      component={Link}
                      to={page.href!}
                      sx={{
                        justifyContent: currentOpen ? "initial" : "center",
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: currentOpen ? 3 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={page.title}
                        sx={{ opacity: currentOpen ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              );
            })}
          </List>
        </Drawer>
      </Box>
    );

    function toggleDrawer(event: SyntheticEvent<{}, Event>): void {
      setCurrentOpen((p) => !p);
    }
  }
);
