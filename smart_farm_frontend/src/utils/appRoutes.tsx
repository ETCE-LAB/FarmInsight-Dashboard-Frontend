export class AppRoutes {
    static base = "/"
    static organization = "/organization/:organizationId"
    static editFpf = "/organization/:organizationId/fpf/:fpfId/edit"
    static displayFpf = "/organization/:organizationId/fpf/:fpfId"
    static energyDashboard = "/organization/:organizationId/fpf/:fpfId/energy"
    static editUserProfile = "/userprofile/edit"
    static legalNotice = "/legal-notice"
    static statusOverview = "/status-overview"
    static adminPage = "/admin"
    static resourceHub = "/organization/:organizationId/fpf/:fpfId/resources"
    static waterDashboard = "/organization/:organizationId/fpf/:fpfId/water"
}