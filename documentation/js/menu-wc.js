'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">precos-fe documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-3e70632498a2e8631e1c1e3f45d87cc2ef5e2fca0e5132a80768e37020f75443e70223bb00d9db5c62af57cba6e43d589f20f08b6c2629572d0d32138436a8d1"' : 'data-target="#xs-components-links-module-AppModule-3e70632498a2e8631e1c1e3f45d87cc2ef5e2fca0e5132a80768e37020f75443e70223bb00d9db5c62af57cba6e43d589f20f08b6c2629572d0d32138436a8d1"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-3e70632498a2e8631e1c1e3f45d87cc2ef5e2fca0e5132a80768e37020f75443e70223bb00d9db5c62af57cba6e43d589f20f08b6c2629572d0d32138436a8d1"' :
                                            'id="xs-components-links-module-AppModule-3e70632498a2e8631e1c1e3f45d87cc2ef5e2fca0e5132a80768e37020f75443e70223bb00d9db5c62af57cba6e43d589f20f08b6c2629572d0d32138436a8d1"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/FooterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FooterComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/HeaderComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HeaderComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoggedInLayoutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoggedInLayoutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/LoginLayoutComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LoginLayoutComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/MainMenuComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >MainMenuComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PageNotFoundComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PageNotFoundComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link" >AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/BronchopulmonaryModule.html" data-type="entity-link" >BronchopulmonaryModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-BronchopulmonaryModule-714bf69d4847a03f43e06d35affa815fc6330142cb24df02057a127517a5e0b2884a624ab3230a494974fa5710f17bf726f2af225a3b47e59d208b643e42e0fa"' : 'data-target="#xs-components-links-module-BronchopulmonaryModule-714bf69d4847a03f43e06d35affa815fc6330142cb24df02057a127517a5e0b2884a624ab3230a494974fa5710f17bf726f2af225a3b47e59d208b643e42e0fa"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-BronchopulmonaryModule-714bf69d4847a03f43e06d35affa815fc6330142cb24df02057a127517a5e0b2884a624ab3230a494974fa5710f17bf726f2af225a3b47e59d208b643e42e0fa"' :
                                            'id="xs-components-links-module-BronchopulmonaryModule-714bf69d4847a03f43e06d35affa815fc6330142cb24df02057a127517a5e0b2884a624ab3230a494974fa5710f17bf726f2af225a3b47e59d208b643e42e0fa"' }>
                                            <li class="link">
                                                <a href="components/CBPMainComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CBPMainComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CBPPatientComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CBPPatientComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CBPPatientListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CBPPatientListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CBPTrackingComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CBPTrackingComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/BronchopulmonaryRoutingModule.html" data-type="entity-link" >BronchopulmonaryRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/ColonRectalModule.html" data-type="entity-link" >ColonRectalModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-ColonRectalModule-141d8c56cdeeb953a459c7b0f95df356cc6a7038bfd24232d088926001c45f4c87104c0ec33ba792d606d4b57f049ef7906b94754aa973cc36211f0ec74cea55"' : 'data-target="#xs-components-links-module-ColonRectalModule-141d8c56cdeeb953a459c7b0f95df356cc6a7038bfd24232d088926001c45f4c87104c0ec33ba792d606d4b57f049ef7906b94754aa973cc36211f0ec74cea55"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-ColonRectalModule-141d8c56cdeeb953a459c7b0f95df356cc6a7038bfd24232d088926001c45f4c87104c0ec33ba792d606d4b57f049ef7906b94754aa973cc36211f0ec74cea55"' :
                                            'id="xs-components-links-module-ColonRectalModule-141d8c56cdeeb953a459c7b0f95df356cc6a7038bfd24232d088926001c45f4c87104c0ec33ba792d606d4b57f049ef7906b94754aa973cc36211f0ec74cea55"' }>
                                            <li class="link">
                                                <a href="components/CCRMainComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CCRMainComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CCRPatientComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CCRPatientComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/CCRPatientListComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CCRPatientListComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/ColonRectalSummaryComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ColonRectalSummaryComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/ColonRectalRoutingModule.html" data-type="entity-link" >ColonRectalRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PatientModule.html" data-type="entity-link" >PatientModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-PatientModule-e3bc84deb6a0f87a7161d18092a23e45fb8946b8a452b1cb6cc419bade3c7c05decd62680f269188748e97fce31ddfd451a666c261b2c8cd5219c3c7ed92759e"' : 'data-target="#xs-components-links-module-PatientModule-e3bc84deb6a0f87a7161d18092a23e45fb8946b8a452b1cb6cc419bade3c7c05decd62680f269188748e97fce31ddfd451a666c261b2c8cd5219c3c7ed92759e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-PatientModule-e3bc84deb6a0f87a7161d18092a23e45fb8946b8a452b1cb6cc419bade3c7c05decd62680f269188748e97fce31ddfd451a666c261b2c8cd5219c3c7ed92759e"' :
                                            'id="xs-components-links-module-PatientModule-e3bc84deb6a0f87a7161d18092a23e45fb8946b8a452b1cb6cc419bade3c7c05decd62680f269188748e97fce31ddfd451a666c261b2c8cd5219c3c7ed92759e"' }>
                                            <li class="link">
                                                <a href="components/PatientProfileComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PatientProfileComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/PatientRegisterComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PatientRegisterComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SchedulingModule.html" data-type="entity-link" >SchedulingModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SchedulingModule-25f070e35a92799b110278492275144593723e2ee60b1337959b552f7efad2f0da637ac1905fa3532c52027b45b491585d2327e745002d97f38acbfe91216575"' : 'data-target="#xs-components-links-module-SchedulingModule-25f070e35a92799b110278492275144593723e2ee60b1337959b552f7efad2f0da637ac1905fa3532c52027b45b491585d2327e745002d97f38acbfe91216575"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SchedulingModule-25f070e35a92799b110278492275144593723e2ee60b1337959b552f7efad2f0da637ac1905fa3532c52027b45b491585d2327e745002d97f38acbfe91216575"' :
                                            'id="xs-components-links-module-SchedulingModule-25f070e35a92799b110278492275144593723e2ee60b1337959b552f7efad2f0da637ac1905fa3532c52027b45b491585d2327e745002d97f38acbfe91216575"' }>
                                            <li class="link">
                                                <a href="components/CCRAppointmentDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CCRAppointmentDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/SchedulerComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SchedulerComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link" >SharedModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SharedModule-0109ff41a888d93f57d11daa0fd57563c58296e1afa560d0c94d4b29858dafc83f5cc078a84f617978f23a71787d58d3728853bd06725b2a98f6292e5a566d37"' : 'data-target="#xs-components-links-module-SharedModule-0109ff41a888d93f57d11daa0fd57563c58296e1afa560d0c94d4b29858dafc83f5cc078a84f617978f23a71787d58d3728853bd06725b2a98f6292e5a566d37"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SharedModule-0109ff41a888d93f57d11daa0fd57563c58296e1afa560d0c94d4b29858dafc83f5cc078a84f617978f23a71787d58d3728853bd06725b2a98f6292e5a566d37"' :
                                            'id="xs-components-links-module-SharedModule-0109ff41a888d93f57d11daa0fd57563c58296e1afa560d0c94d4b29858dafc83f5cc078a84f617978f23a71787d58d3728853bd06725b2a98f6292e5a566d37"' }>
                                            <li class="link">
                                                <a href="components/ConfirmDialogComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConfirmDialogComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/EditUserComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EditUserComponent</a>
                                            </li>
                                            <li class="link">
                                                <a href="components/TitleComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TitleComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#directives-links-module-SharedModule-0109ff41a888d93f57d11daa0fd57563c58296e1afa560d0c94d4b29858dafc83f5cc078a84f617978f23a71787d58d3728853bd06725b2a98f6292e5a566d37"' : 'data-target="#xs-directives-links-module-SharedModule-0109ff41a888d93f57d11daa0fd57563c58296e1afa560d0c94d4b29858dafc83f5cc078a84f617978f23a71787d58d3728853bd06725b2a98f6292e5a566d37"' }>
                                        <span class="icon ion-md-code-working"></span>
                                        <span>Directives</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="directives-links-module-SharedModule-0109ff41a888d93f57d11daa0fd57563c58296e1afa560d0c94d4b29858dafc83f5cc078a84f617978f23a71787d58d3728853bd06725b2a98f6292e5a566d37"' :
                                        'id="xs-directives-links-module-SharedModule-0109ff41a888d93f57d11daa0fd57563c58296e1afa560d0c94d4b29858dafc83f5cc078a84f617978f23a71787d58d3728853bd06725b2a98f6292e5a566d37"' }>
                                        <li class="link">
                                            <a href="directives/PermissionDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PermissionDirective</a>
                                        </li>
                                        <li class="link">
                                            <a href="directives/SpecialityDirective.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SpecialityDirective</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersManagementModule.html" data-type="entity-link" >UsersManagementModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-UsersManagementModule-f5c73a0890353dd4ea1ffc00c6194322f7d97e16d6b8ed87ec0951bc62b55e2d9166eaa1d09f3ead0add8dca52b2df51627c6a652a51c17066934f78b218609c"' : 'data-target="#xs-components-links-module-UsersManagementModule-f5c73a0890353dd4ea1ffc00c6194322f7d97e16d6b8ed87ec0951bc62b55e2d9166eaa1d09f3ead0add8dca52b2df51627c6a652a51c17066934f78b218609c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-UsersManagementModule-f5c73a0890353dd4ea1ffc00c6194322f7d97e16d6b8ed87ec0951bc62b55e2d9166eaa1d09f3ead0add8dca52b2df51627c6a652a51c17066934f78b218609c"' :
                                            'id="xs-components-links-module-UsersManagementModule-f5c73a0890353dd4ea1ffc00c6194322f7d97e16d6b8ed87ec0951bc62b55e2d9166eaa1d09f3ead0add8dca52b2df51627c6a652a51c17066934f78b218609c"' }>
                                            <li class="link">
                                                <a href="components/UsersComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersManagementRoutingModule.html" data-type="entity-link" >UsersManagementRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AppConstants.html" data-type="entity-link" >AppConstants</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppError.html" data-type="entity-link" >AppError</a>
                            </li>
                            <li class="link">
                                <a href="classes/CBPConstants.html" data-type="entity-link" >CBPConstants</a>
                            </li>
                            <li class="link">
                                <a href="classes/CCRConstants.html" data-type="entity-link" >CCRConstants</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AdministrativeService.html" data-type="entity-link" >AdministrativeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthenticationService.html" data-type="entity-link" >AuthenticationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CBPPatientService.html" data-type="entity-link" >CBPPatientService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CBPSchedulingService.html" data-type="entity-link" >CBPSchedulingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CCRPatientService.html" data-type="entity-link" >CCRPatientService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CCRSchedulingService.html" data-type="entity-link" >CCRSchedulingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DateTimeService.html" data-type="entity-link" >DateTimeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PatientService.html" data-type="entity-link" >PatientService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link" >UsersService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interceptors-links"' :
                            'data-target="#xs-interceptors-links"' }>
                            <span class="icon ion-ios-swap"></span>
                            <span>Interceptors</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="interceptors-links"' : 'id="xs-interceptors-links"' }>
                            <li class="link">
                                <a href="interceptors/AuthInterceptor.html" data-type="entity-link" >AuthInterceptor</a>
                            </li>
                            <li class="link">
                                <a href="interceptors/ErrorInterceptor.html" data-type="entity-link" >ErrorInterceptor</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AccessGuard.html" data-type="entity-link" >AccessGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/PermissionGuard.html" data-type="entity-link" >PermissionGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/SpecialityGuard.html" data-type="entity-link" >SpecialityGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/addOptions.html" data-type="entity-link" >addOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AppointmentData.html" data-type="entity-link" >AppointmentData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CancerCheck.html" data-type="entity-link" >CancerCheck</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CBPBiopsy.html" data-type="entity-link" >CBPBiopsy</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CBPBiopsyType.html" data-type="entity-link" >CBPBiopsyType</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CBPEnrollmentSchedule.html" data-type="entity-link" >CBPEnrollmentSchedule</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CBPEnrollmentSurvey.html" data-type="entity-link" >CBPEnrollmentSurvey</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CBPPatient.html" data-type="entity-link" >CBPPatient</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CBPPatientEnrollmentSchedule.html" data-type="entity-link" >CBPPatientEnrollmentSchedule</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CCREnrollmentPatientSchedule.html" data-type="entity-link" >CCREnrollmentPatientSchedule</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CCREnrollmentSchedule.html" data-type="entity-link" >CCREnrollmentSchedule</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CCREnrollmentSurvey.html" data-type="entity-link" >CCREnrollmentSurvey</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CCRPatient.html" data-type="entity-link" >CCRPatient</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CCRPatientSchedule.html" data-type="entity-link" >CCRPatientSchedule</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CCRRiskSurveyFamily.html" data-type="entity-link" >CCRRiskSurveyFamily</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CCRRiskSurveyFamilyCancer.html" data-type="entity-link" >CCRRiskSurveyFamilyCancer</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CCRRiskSurveyGeneral.html" data-type="entity-link" >CCRRiskSurveyGeneral</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CCRRiskSurveyHabits.html" data-type="entity-link" >CCRRiskSurveyHabits</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CCRRiskSurveyPathologies.html" data-type="entity-link" >CCRRiskSurveyPathologies</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Coloncheck.html" data-type="entity-link" >Coloncheck</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Colonoscopy.html" data-type="entity-link" >Colonoscopy</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Column.html" data-type="entity-link" >Column</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ColumnInterface.html" data-type="entity-link" >ColumnInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ColumnInterface-1.html" data-type="entity-link" >ColumnInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ConfirmDialogData.html" data-type="entity-link" >ConfirmDialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CustomHttpResponse.html" data-type="entity-link" >CustomHttpResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DialogData.html" data-type="entity-link" >DialogData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExamResult.html" data-type="entity-link" >ExamResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ExtendedProps.html" data-type="entity-link" >ExtendedProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FamilyMember.html" data-type="entity-link" >FamilyMember</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FeaturePermission.html" data-type="entity-link" >FeaturePermission</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Patient.html" data-type="entity-link" >Patient</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Privilege.html" data-type="entity-link" >Privilege</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PRIVILEGE.html" data-type="entity-link" >PRIVILEGE</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Profession.html" data-type="entity-link" >Profession</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Region.html" data-type="entity-link" >Region</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Schedule.html" data-type="entity-link" >Schedule</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ScreeningSurveyQuestion.html" data-type="entity-link" >ScreeningSurveyQuestion</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Session.html" data-type="entity-link" >Session</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Specialization.html" data-type="entity-link" >Specialization</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TabItem.html" data-type="entity-link" >TabItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TabItem-1.html" data-type="entity-link" >TabItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TAC.html" data-type="entity-link" >TAC</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TACTrackingPatient.html" data-type="entity-link" >TACTrackingPatient</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserModel.html" data-type="entity-link" >UserModel</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});