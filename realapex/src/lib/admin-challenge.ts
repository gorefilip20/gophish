/** Message the admin wallet must sign to authenticate (client + server agree). */
export function buildAdminChallenge(timestamp: number) {
  return `RealApex Admin Authentication\nTimestamp: ${timestamp}\nSign to access the control panel.`;
}
