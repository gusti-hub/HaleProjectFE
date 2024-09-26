import TimeExpenses from "../adminPages/Time&Expenses/TimeExpenses"

export default class GlobalVariable {

    static ActionRole = {
        DashboardNavigation: 'Dashboard Navigation',
        ProjectManagementNavigation: 'Project Management Navigation',
        EmployeeRegistrationNavigation: 'Employee Registration Navigation',
        VendorRegistrationNavigation: 'Vendor Registration Navigation',
        ClientRegistrationNavigation: 'Client Registration Navigation',
        RoleRegistrationNavigation: 'Role Registration Navigation',
        AuthorizationRoleNavigation: 'Authorization Role Navigation',
        ProcurementNavigation: 'Procurement Navigation',
        InventoryNavigation : 'Inventory Navigation',
        ConfigurationNavigation : 'Configuration Navigation',
        TimeExpensesNavigation : 'Time Expnses Navigation',
        ApproveDesign : 'Approve Design',
        RejectDesign : 'Reject Design',
        ApproveProposal : 'Approve Proposal',
        RejectProposal : 'Reject Proposal',
        DeleteProject : 'Delete Project',
        CreateProject : 'Create Project'
    }

    static Progress = {
        NotStarted: 'Not Started',
        InProgress: 'In progress',
        WaitingDesignApproval: 'Waiting For Design Approval',
        DesignApproved: 'Design Approved',
        DesignRejected: 'Design Rejected',
        WaitingProposalApproval: 'Waiting For Proposal Approval',
        ProposalApproved: 'Proposal Approved',
        ProposalRejected: 'Proposal Rejected',
        DownloadProposal: 'Download Proposal',
        ProjectFunding : 'Project Funding',
        ProjectImplementation : 'Project Implementation',
        ProjectCompleted : 'Project Completed'
    }

    static ProductStatus = {
        WaitingForClientApproval: 'Waiting for Client Approval',
        ClientApproved: 'Client Approved',
        ClientRejected: 'Client Rejected',
    }

    static ConfigurationType = {
        Unit: 'Unit',
        Furnishing: 'Furnishing',
        Room: 'Room'
    }
}