public class VoiceInputButtonController {
    
    @AuraEnabled
    public static Case getCase(Id caseId) {
        return [SELECT Id, Description FROM Case WHERE Id = :caseId];
    }
    
    @AuraEnabled
    public static void updateCase(Case caseObj) {
        update caseObj;
    }
}