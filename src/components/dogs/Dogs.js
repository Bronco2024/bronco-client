import React from "react";

const Dogs = () => {
  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        background: "#f7f9fb",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            color: "#173b5e",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          🐶 כלבים
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#777",
            marginBottom: "30px",
          }}
        >
          מצאו את הכלב שמתאים לכם
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "18px",
              padding: "15px",
              boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "230px",
                borderRadius: "14px",
                overflow: "hidden",
                background: "#eee",
                marginBottom: "15px",
              }}
            >
              <img
                src="/dogs.jpg"
                alt="כלב"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            <h2 style={{ color: "#173b5e", marginBottom: "15px" }}>
              כלב
            </h2>

            <p>🐾 סוג: כלב</p>
            <p>🎂 גיל: --</p>
            <p>⚥ מין: --</p>
            <p>📜 תעודה: כן / לא</p>
            <p>💰 מחיר: -- ₪</p>

            <p
              style={{
                color: "#666",
                lineHeight: "1.6",
                marginTop: "15px",
              }}
            >
              תיאור קצר של הכלב יופיע כאן.
            </p>

            <button
              type="button"
              style={{
                width: "100%",
                marginTop: "15px",
                padding: "12px",
                border: "none",
                borderRadius: "10px",
                background: "#173b5e",
                color: "#fff",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              📞 צור קשר
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dogs;
