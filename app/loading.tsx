export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "3px solid rgb(249,248,245)",
          borderTopColor: "rgb(108,71,255)",
          animation: "spin 0.8s linear infinite",
        }}
      />
    </div>
  );
}
