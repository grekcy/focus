package v1alpha1

import (
	"context"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"

	"focus/models"
	"focus/proto/v1alpha1"
)

func TestLogin(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	client := newUnauthenticatedTestClient(ctx, t)
	got, err := client.LoginWithGoogleOauth(ctx, &v1alpha1.GoogleLoginReq{
		Credential: "eyJhbGciOiJSUzI1NiIsImtpZCI6ImFjZGEzNjBmYjM2Y2QxNWZmODNhZjgzZTE3M2Y0N2ZmYzM2ZDExMWMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2ODEyMDk3NzMsImF1ZCI6IjI0MzE1Mzg1NTMyOS1obmxtYW5oczk5M2Q0YnF2ODRpMzlrN2o3N2JoMTlmcC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjExMDUwMDI0OTM2MjM0ODQyOTU4OSIsImVtYWlsIjoid2hpdGVraWRAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF6cCI6IjI0MzE1Mzg1NTMyOS1obmxtYW5oczk5M2Q0YnF2ODRpMzlrN2o3N2JoMTlmcC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsIm5hbWUiOiJDaGVuZy1EYWUgQ2hvZSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BR05teXhZXzNYTEFPXzRZUXJ4TzE5d09yU0ptMmtqNEVyVUV2UG94anR0M2ZXWT1zOTYtYyIsImdpdmVuX25hbWUiOiJDaGVuZy1EYWUiLCJmYW1pbHlfbmFtZSI6IkNob2UiLCJpYXQiOjE2ODEyMTAwNzMsImV4cCI6MTY4MTIxMzY3MywianRpIjoiMDNiMGZkZDdiZDMxZTJmZWI5ZTQ5MDAwOTEzOWNlODdkN2UzNDYyZCJ9.CqUsFvwPBsmrMF5oJlOgiXkqhecXp9VSHprywV0szAbsMgMpCID9VIbUkEti10xbwdnBs0tlk0M8pTtSvs7ZP6WT9rbxmkbl-VNrTUnPE4mEooTi3cFm8MUkovNpp6reKsROOX6yVIJpX3ZmgYbPWpj9gKcvbjUwM9LrIfJ_B7YQf2LPt8Wz1DFDkIrBbVm_JVH57rEwPH5u-1tbZEg0ODg__oUCaCdQCGI1u0bDTVKawlnQNkccquNwbGrxXyxo_-tcLe0OIU_wPfgRoTBM5kK-UqgRAswuau15jJNjpbX99h6gvaif9PCDzDN4Kz3WlJ9O8HmgBe1C9witUGeLww",
		ClientId:   "243153855329-hnlmanhs993d4bqv84i39k7j77bh19fp.apps.googleusercontent.com",
		Extra:      "__charlie__",
	})
	require.NoError(t, err)
	require.NotEmpty(t, got.Value)
}

func oauthTokenForTest(t *testing.T, email string, name string) string {
	// NOTE google oauth는 RAS256으로 signing 되어 있음
	token, err := jwt.NewWithClaims(jwt.SigningMethodHS512, jwt.MapClaims{
		"iss":   "focus test",
		"email": email,
		"name":  name,
		"iat":   jwt.NewNumericDate(time.Now()),
		"exp":   jwt.NewNumericDate(time.Now().Add(30 * time.Minute)),
	}).SignedString([]byte("dummy"))
	require.NoError(t, err)

	return token
}

func TestLoginUserNotExists(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	email := "new-user@focus.com"

	client := newUnauthenticatedTestClient(ctx, t)

	{
		user, err := client.service.getUserByEmail(ctx, email)
		if err == nil {
			userWorkspaces := []*models.UserWorkspace{}
			require.NoError(t, client.service.db.Unscoped().Find(&userWorkspaces, models.UserWorkspace{UserID: user.ID}).Error)

			for _, uw := range userWorkspaces {
				client.service.db.Transaction(func(txn *gorm.DB) error {
					require.NoError(t, txn.Unscoped().Delete(&models.UserWorkspace{}, uw.ID).Error)
					require.NoError(t, txn.Unscoped().Where("workspace_id = ?", uw.WorkspaceID).Delete(&models.Label{}).Error)
					require.NoError(t, txn.Unscoped().Delete(&models.Workspace{}, uw.WorkspaceID).Error)
					require.NoError(t, txn.Unscoped().Delete(&models.User{}, uw.UserID).Error)
					return nil
				})
			}
			require.NoError(t, client.service.db.Unscoped().Delete(user).Error)
		}
	}

	cred := oauthTokenForTest(t, email, "New user")
	got, err := client.LoginWithGoogleOauth(ctx, &v1alpha1.GoogleLoginReq{
		Credential: cred,
		ClientId:   "dummy",
	})
	require.NoError(t, err)
	require.NotEmpty(t, got.Value)

	uid, err := parseAPIKey(got.Value)
	require.NoError(t, err)
	require.NotEmpty(t, uid)

	user, err := client.service.getUserByUID(ctx, uid)
	require.NoError(t, err)

	require.Equal(t, email, user.Email)
	require.Equal(t, uid, user.UID)

	userWorkspace, err := client.service.userDefaultWorkspace(user.ID)
	require.NoError(t, err, "default workspace not found")
	require.Equal(t, user.Email, userWorkspace.Name)

	labels, err := client.service.listLabels(ctx, &models.Label{WorkspaceID: userWorkspace.ID})
	require.NoError(t, err)
	require.NotEmpty(t, labels)
}
