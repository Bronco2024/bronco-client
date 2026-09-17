# Firestore indexes (Petzo)

## Seeds filters — fixed in code
`/seeds` filters no longer build multi-field Firestore queries
(that required missing composite indexes and crashed in Sentry).

Filtering is done **client-side** after:
`category == זרע` + `orderBy(createdAt desc)`.

## If Sentry still shows “query requires an index”
Open the link from the error (Firebase Console → create index) and click **Create**.

Typical needed index for category pages:
- Collection: `ads`
- Fields: `category` Asc + `createdAt` Desc

Direct console:
https://console.firebase.google.com/project/bronco-65aaf/firestore/indexes

Index build can take a few minutes.
