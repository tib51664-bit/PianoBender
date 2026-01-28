import { index, prefix, route, type RouteConfig } from '@react-router/dev/routes'

export default [
  route(undefined, './layouts/MainLayout.tsx', [
    index('./home/page.tsx'),
    route('play-song', './songs/page.tsx'),
    route('free-play', './freeplay/page.tsx'),
    route('credits', './about/page.tsx'),
  ]),
  route('play', './play/page.tsx'),
] satisfies RouteConfig
