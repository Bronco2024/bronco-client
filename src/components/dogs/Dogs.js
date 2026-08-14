import React from "react";

const Dogs = () => {
  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        background: "#f5f8fc",
        padding: "45px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          <h1
            style={{
              margin: 0,
              color: "#173b5e",
              fontSize: "42px",
              fontWeight: "800",
            }}
          >
            כלבים
          </h1>

          <p
            style={{
              marginTop: "12px",
              color: "#718096",
              fontSize: "19px",
            }}
          >
            מצאו את הכלב שמתאים לכם
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "24px",
            padding: "22px",
            boxShadow: "0 12px 35px rgba(23,59,94,0.10)",
            maxWidth: "650px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "360px",
              overflow: "hidden",
              borderRadius: "18px",
              background: "#eef2f6",
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

          <div style={{ padding: "20px 8px 5px" }}>
            <h2
              style={{
                margin: "0 0 20px",
                color: "#173b5e",
                fontSize: "30px",
              }}
            >
              כלב
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
                color: "#374151",
                fontSize: "17px",
              }}
            >
              <div>
                <strong>גזע:</strong> לא צוין
              </div>

              <div>
                <strong>גיל:</strong> לא צוין
              </div>

              <div>
                <strong>מין:</strong> לא צוין
              </div>

              <div>
                <strong>תעודה:</strong> כן / לא
              </div>

              <div>
                <strong>מחיר:</strong> לא צוין
              </div>
            </div>

            <p
              style={{
                marginTop: "25px",
                color: "#6b7280",
                lineHeight: "1.8",
                fontSize: "16px",
              }}
            >
              תיאור קצר של הכלב יופיע כאן. כאן ניתן להציג מידע נוסף
              על הכלב, אופיו וכל הפרטים החשובים עבור הקונה.
            </p>

            <button
              type="button"
              style={{
                width: "100%",
                marginTop: "20px",
                padding: "15px",
                border: "none",
                borderRadius: "12px",
                background: "#173b5e",
                color: "#ffffff",
                fontSize: "18px",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              צור קשר
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dogs;
