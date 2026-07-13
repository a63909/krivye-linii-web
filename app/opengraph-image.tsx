import { ImageResponse } from "next/og";

export const alt = "Кривые Линии WEB — веб-дизайн, разработка и айдентика";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#080b0a",
          color: "#f4f1e9",
          padding: "54px 64px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            opacity: 0.17,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.16) 1px, transparent 1px)",
            backgroundSize: "92px 92px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "8px",
            display: "flex",
            background:
              "linear-gradient(90deg, #f6df72 0 52%, #d88ab5 52% 70%, #8991dc 70% 100%)",
          }}
        />

        <div
          style={{
            width: "47%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRight: "1px solid rgba(255,255,255,.22)",
            paddingRight: "44px",
          }}
        >
          <img
            src="https://web.curvedlines.ru/images/brand/krivye-linii-web-transparent.png"
            alt=""
            width="500"
            height="353"
            style={{
              width: "500px",
              height: "353px",
              objectFit: "contain",
            }}
          />
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: "62px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "18px",
              letterSpacing: "5px",
              color: "#aeb3b0",
              marginBottom: "26px",
            }}
          >
            КРИВЫЕ ЛИНИИ / WEB
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "60px",
              lineHeight: 1.02,
              letterSpacing: "-2px",
              fontWeight: 600,
              maxWidth: "520px",
            }}
          >
            Сайты и бренды, которые работают на бизнес.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "34px",
              fontSize: "21px",
              color: "#c2c5c1",
              letterSpacing: "1px",
            }}
          >
            WEB-ДИЗАЙН · РАЗРАБОТКА · АЙДЕНТИКА
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: "64px",
            bottom: "38px",
            display: "flex",
            fontSize: "16px",
            letterSpacing: "2px",
            color: "#7f8581",
          }}
        >
          WEB.CURVEDLINES.RU
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
