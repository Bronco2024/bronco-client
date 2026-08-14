import React from "react";

const Dogs = () => {
  return (
    <main
      dir="rtl"
      style={{
        minHeight: "100vh",
        padding: "50px 20px",
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
            fontSize: "38px",
            marginBottom: "10px",
          }}
        >
          כלבים
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#777",
            fontSize: "19px",
            marginBottom: "40px",
          }}
        >
          מצאו את הכלב שמתאים לכם
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "25px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
              border: "1px solid #eef1f4",
            }}
          >
            <img
              src="/dogs.jpg"
              alt="כלב"
              style={{
                width: "100%",
                height: "270px",
                objectFit: "cover",
                display: "block",
              }}
            />

            <div style={{ padding: "25px" }}>
              <h2
                style={{
                  color: "#173b5e",
                  fontSize: "27px",
                  margin: "0 0 22px",
                }}
              >
                גולדן רטריבר
              </h2>

              <div
                style={{
                  display: "grid",
                  gap: "14px",
                  color: "#333",
                  fontSize: "17px",
                }}
              >
                <div>
                  <strong>גזע:</strong> גולדן רטריבר
                </div>

                <div>
                  <strong>גיל:</strong> 3 חודשים
                </div>

                <div>
                  <strong>מין:</strong> זכר
                </div>

                <div>
                  <strong>תעודה:</strong> יש
                </div>

                <div>
                  <strong>מחיר:</strong>{" "}
                  <span
                    style={{
                      color: "#173b5e",
                      fontWeight: "bold",
                      fontSize: "20px",
                    }}
                  >
                    4,500 ₪
                  </span>
                </div>
              </div>

              <div
                style={{
                  marginTop: "25px",
                  paddingTop: "20px",
                  borderTop: "1px solid #eee",
                }}
              >
                <h3
                  style={{
                    color: "#173b5e",
                    marginBottom: "8px",
                  }}
                >
                  תיאור
                </h3>

                <p
                  style={{
                    color: "#666",
                    lineHeight: "1.7",
                    margin: 0,
                  }}
                >
                  כלב חברותי ומתאים למשפחה. פרטים נוספים על הכלב יופיעו כאן.
                </p>
              </div>

              <button
                type="button"
                style={{
                  width: "100%",
                  marginTop: "25px",
                  padding: "14px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#173b5e",
                  color: "#fff",
                  fontSize: "17px",
                  cursor: "pointer",
                }}
              >
                צור קשר
              </button>

              <button
                type="button"
                style={{
                  width: "100%",
                  marginTop: "10px",
                  padding: "13px",
                  border: "1px solid #173b5e",
                  borderRadius: "10px",
                  background: "#fff",
                  color: "#173b5e",
                  fontSize: "16px",
                  cursor: "pointer",
                }}
              >
                סרטון
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dogs;
