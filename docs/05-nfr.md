# Non-Functional Requirements (NFR)

## Performance & Latency Targets
- **Workflow Generation Time**: Client-side recommendation calculation < 100ms.
- **Initial Page Load (LCP)**: < 1.2s on standard 4G connections.
- **Interactive Input Latency (FID / INP)**: < 50ms response for tool swaps, price overrides, and step customization.
- **Visual Diagram Render Latency**: Smooth SVG/Flex graph rendering with 0 layout shift (CLS < 0.05).

## Reliability & Scale
- **Uptime**: 99.9% availability for static client application host.
- **Offline / Local Capabilities**: Engine functions entirely offline without network latency after initial static page bundle load.

## Cost Limits
- **Infrastructure Cost**: Zero runtime API key cost for core recommendation engine.
