import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    header: {
                        title: 'FARMINSIGHT',
                        organizations: 'Organizations',
                        myOrganizations: 'My Organizations',
                        loginToManage: 'Login to manage organization',
                        loginToManageFpf: 'Login to manage facility',
                        loginToSee: 'Login to see your organizations',
                        login: 'Login',
                        logout: 'Logout',
                        search: 'Search FPFs...',
                        kick: 'Remove',
                        promote: 'Promote',
                        email: 'Email',
                        name: 'Name',
                        enterName: 'Enter Name',
                        address: 'Address',
                        enterAddress: 'Enter Address',
                        location: 'Location',
                        enterLocation: 'Enter Location',
                        role: 'Role',
                        organization: 'Organization',
                        searchUserProfile: 'Search User Profile',
                        noProfilesFound: 'No profiles found',
                        addUser: 'Add User',
                        noUserSelected: 'No user selected',
                        addSelectedUser: 'Add Selected User',
                        usersAdded: ' users have been added',
                        addFpf: 'Add FPF',
                        addOrganization: 'Create Organization',
                        createOrganization: 'Create new Organization',
                        public: 'Public',
                        private: 'Private',
                        yesDelete: 'Yes, delete',
                        cancel: 'Cancel',
                        confirmDialog: 'This action cannot be undone. Do you want to proceed with deleting this growing cycle?',
                        members: 'Members',
                        isActive: 'Active',
                        actions: 'Actions',
                        addSensor: 'Add Sensor',
                        table: {
                            name: 'Name',
                            planted: 'Planted on',
                            harvested: 'Harvested on',
                            notes: 'Notes'
                        }
                    },
                    growingCycleForm: {
                        plantTypeLabel: 'Plant Type',
                        plantTypePlaceholder: 'Enter Plant Type',
                        startDateLabel: 'Start Date',
                        startDatePlaceholder: 'Select Start Date',
                        endDateLabel: 'End Date',
                        endDatePlaceholder: 'Select End Date',
                        notesLabel: 'Notes',
                        notesPlaceholder: 'Enter Notes',
                        saveButton: 'Save',
                    },
                    button: {
                        loginToManage: 'Login to manage organization',
                        create: 'Create',
                        add: 'Add'
                    },
                    label: {
                        organizationName: 'Organization Name',
                        setPublic: 'Set Public'
                    },
                    placeholder: {
                        enterOrganizationName: 'Enter organization name'
                    },
                    error: {
                        organizationNameTaken: 'Organization Name already taken'
                    },
                    userprofile: {
                        notifications: {
                            success: {
                                title: 'Successfully updated',
                                message: 'Updated the Profile name successfully!',
                            },
                            error: {
                                title: 'Unable to update profile name',
                            }
                        },
                        enterName: 'Enter your display name',
                        saveChanges: 'Save Changes',

                    },
                    camera: {
                        location: 'Location',
                        enterLocation: 'Enter Location',
                        modelNr: 'Model Nr.',
                        enterModelNr: 'Enter Model Nr.',
                        intervalSeconds: 'Interval in Seconds',
                        enterIntervalSeconds: 'Enter Interval in Seconds',
                        resolution: 'Resolution',
                        enterResolution: 'Enter Resolution',
                        livestreamUrl: 'Livestream URL',
                        enterLivestreamUrl: 'Enter Livestream URL',
                        snapshotUrl: 'Snapshot URL',
                        enterSnapshotUrl: 'Enter Snapshot URL',
                        addCamera: 'Add Camera',
                        editCamera: 'Edit Camera',
                        createCamera: 'Create Camera',
                    }
                },
            },
            de: {
                translation: {
                    header: {
                        title: 'FARMINSIGHT',
                        organizations: 'Organisationen',
                        myOrganizations: 'Meine Organisationen',
                        loginToManage: 'Einloggen, um Organisation zu verwalten',
                        loginToSee: 'Einloggen, um Ihre Organisationen zu sehen',
                        login: 'Einloggen',
                        logout: 'Abmelden',
                        search: 'FPFs durchsuchen...',
                        kick: 'Entfernen',
                        promote: 'Befördern',
                        email: 'E-Mail-Adresse',
                        name: 'Name',
                        enterName: 'Name eingeben',
                        address: 'Adresse',
                        enterAddress: 'Adresse eingeben',
                        location: 'Standort',
                        enterLocation: 'Standort eingeben',
                        role: 'Rolle',
                        organization: 'Organisation',
                        searchUserProfile: 'Nutzerprofil suchen',
                        addUser: 'Benutzer hinzufügen',
                        noProfilesFound: 'Keine Profile gefunden',
                        noUserSelected: 'Kein Benutzer ausgewählt',
                        addSelectedUser: 'Ausgewählten Benutzer hinzufügen',
                        usersAdded: ' Benutzer wurden hinzugefügt',
                        addFpf: 'FPF hinzufügen',
                        addOrganization: 'Organisation erstellen',
                        createOrganization: 'Neue Organisation erstellen',
                        public: 'Öffentlich',
                        private: 'Privat',
                        yesDelete: 'Ja, löschen',
                        cancel: 'Abbrechen',
                        confirmDialog: 'Diese Aktion kann nicht rückgängig gemacht werden. Möchten Sie diesen Wachstumszyklus wirklich löschen?',
                        members: 'Mitglieder',
                        isActive: 'Aktiv',
                        actions: 'Aktionen',
                        addSensor: 'Sensor hinzufügen',
                        table: {
                            name: 'Name',
                            planted: 'Gepflanzt am',
                            harvested: 'Geerntet am',
                            notes: 'Bemerkungen'
                        }
                    },
                    growingCycleForm: {
                        plantTypeLabel: 'Pflanzentyp',
                        plantTypePlaceholder: 'Pflanzentyp eingeben',
                        startDateLabel: 'Startdatum',
                        startDatePlaceholder: 'Startdatum auswählen',
                        endDateLabel: 'Enddatum',
                        endDatePlaceholder: 'Enddatum auswählen',
                        notesLabel: 'Notizen',
                        notesPlaceholder: 'Notizen eingeben',
                        saveButton: 'Speichern',
                    },
                    button: {
                        loginToManage: 'Einloggen, um Organisation zu verwalten',
                        create: 'Erstellen',
                        add: 'Hinzufügen'
                    },
                    label: {
                        organizationName: 'Organisationsname',
                        setPublic: 'Öffentlich einstellen'
                    },
                    placeholder: {
                        enterOrganizationName: 'Geben Sie den Organisationsnamen ein'
                    },
                    error: {
                        organizationNameTaken: 'Organisationsname bereits vergeben'
                    },
                    userprofile: {
                        notifications: {
                            success: {
                                title: 'Erfolgreich aktualisiert',
                                message: 'Profilname erfolgreich aktualisiert!',
                            },
                            error: {
                                title: 'Profilname konnte nicht aktualisiert werden',
                            }
                        },
                        enterName: 'Geben Sie Ihren Anzeigenamen ein',
                        saveChanges: 'Änderungen speichern',
                    },
                    camera: {
                        location: 'Standort',
                        enterLocation: 'Standort eingeben',
                        modelNr: 'Modell Nr.',
                        enterModelNr: 'Modell Nr. eingeben',
                        intervalSeconds: 'Intervall in Sekunden',
                        enterIntervalSeconds: 'Intervall in Sekunden eingeben',
                        resolution: 'Auflösung',
                        enterResolution: 'Auflösung eingeben',
                        livestreamUrl: 'Livestream-URL',
                        enterLivestreamUrl: 'Livestream-URL eingeben',
                        snapshotUrl: 'Snapshot-URL',
                        enterSnapshotUrl: 'Snapshot-URL eingeben',
                        addCamera: 'Kamera hinzufügen',
                        editCamera: 'Kamera bearbeiten',
                        createCamera: 'Kamera erstellen',
                    }
                },
            },
            fr: {
                translation: {
                    header: {
                        title: 'FARMINSIGHT',
                        organizations: 'Organisations',
                        myOrganizations: 'Mes organisations',
                        loginToManage: 'Se connecter pour gérer l’organisation',
                        loginToSee: 'Se connecter pour voir vos organisations',
                        login: 'Se connecter',
                        logout: 'Se déconnecter',
                        search: 'Rechercher des FPF...',
                        kick: 'Retirer',
                        promote: 'Promouvoir',
                        email: 'Adresse e-mail',
                        name: 'Nom',
                        address: 'Adresse',
                        enterAddress: 'Entrez l’adresse',
                        location: 'Emplacement',
                        enterLocation: 'Entrez l’emplacement',
                        enterName: 'Entrez le nom',
                        role: 'Rôle',
                        organization: 'Organisation',
                        searchUserProfile: 'Rechercher un profil utilisateur',
                        noProfilesFound: 'Aucun profil trouvé',
                        addUser: 'Ajouter un utilisateur',
                        noSelectedUser: 'Aucun utilisateur sélectionné',
                        addSelectedUser: 'Ajouter l’utilisateur sélectionné',
                        usersAdded: ' utilis ateurs ont été ajoutés',
                        addFpf: 'Ajouter un FPF',
                        addOrganization: 'Créer une organisation',
                        createOrganization: 'Créer une nouvelle organisation',
                        public: 'Public',
                        private: 'Privé',
                        yesDelete: 'Oui, supprimer',
                        cancel: 'Annuler',
                        confirmDialog: 'Cette action est irréversible. Voulez-vous vraiment supprimer ce cycle de croissance ?',
                        members: 'Membres',
                        isActive: 'Actif',
                        actions: 'Actions',
                        addSensor: 'Ajouter un capteur',
                        table: {
                            name: 'Nom',
                            planted: 'Planté le',
                            harvested: 'Récolté le',
                            notes: 'Remarques'
                        }
                    },
                    growingCycleForm: {
                        plantTypeLabel: 'Type de plante',
                        plantTypePlaceholder: 'Entrez le type de plante',
                        startDateLabel: 'Date de début',
                        startDatePlaceholder: 'Sélectionnez la date de début',
                        endDateLabel: 'Date de fin',
                        endDatePlaceholder: 'Sélectionnez la date de fin',
                        notesLabel: 'Remarques',
                        notesPlaceholder: 'Entrez des remarques',
                        saveButton: 'Enregistrer',
                    },
                    button: {
                        loginToManage: 'Se connecter pour gérer l’organisation',
                        create: 'Créer'
                    },
                    label: {
                        organizationName: 'Nom de l’organisation',
                        setPublic: 'Définir comme public'
                    },
                    placeholder: {
                        enterOrganizationName: 'Entrez le nom de l’organisation'
                    },
                    error: {
                        organizationNameTaken: 'Le nom de l’organisation est déjà pris'
                    },
                    userprofile: {
                        notifications: {
                            success: {
                                title: 'Mise à jour réussie',
                                message: 'Nom du profil mis à jour avec succès !',
                            },
                            error: {
                                title: 'Impossible de mettre à jour le nom du profil',
                            }
                        },
                        enterName: 'Entrez votre nom d’affichage',
                        saveChanges: 'Enregistrer les modifications',
                    },
                    camera: {
                        location: 'Emplacement',
                        enterLocation: 'Entrez l’emplacement',
                        modelNr: 'Numéro de modèle',
                        enterModelNr: 'Entrez le numéro de modèle',
                        intervalSeconds: 'Intervalle en secondes',
                        enterIntervalSeconds: 'Entrez l’intervalle en secondes',
                        resolution: 'Résolution',
                        enterResolution: 'Entrez la résolution',
                        livestreamUrl: 'URL du flux en direct',
                        enterLivestreamUrl: 'Entrez l’URL du flux en direct',
                        snapshotUrl: 'URL de capture instantanée',
                        enterSnapshotUrl: 'Entrez l’URL de capture instantanée',
                        addCamera: 'Ajouter une caméra',
                        editCamera: 'Modifier la caméra',
                        createCamera: 'Créer une caméra',
                    }
                },
            },
            it: {
                translation: {
                    header: {
                        title: 'FARMINSIGHT',
                        organizations: 'Organizzazioni',
                        myOrganizations: 'Le mie organizzazioni',
                        loginToManage: 'Accedi per gestire l’organizzazione',
                        loginToSee: 'Accedi per vedere le tue organizzazioni',
                        login: 'Accedi',
                        logout: 'Disconnettersi',
                        search: 'Cerca FPF...',
                        kick: 'Rimuovere',
                        promote: 'Promuovere',
                        email: 'Indirizzo email',
                        name: 'Nome',
                        address: 'Indirizzo',
                        enterAddress: 'Inserisci l’indirizzo',
                        location: 'Posizione',
                        enterLocation: 'Inserisci la posizione',
                        enterName: 'Inserisci il nome',
                        role: 'Ruolo',
                        organization: 'Organizzazione',
                        searchUserProfile: 'Cerca profilo utente',
                        noProfilesFound: 'Nessun profilo trovato',
                        addUser: 'Aggiungi utente',
                        noUserSelected: 'Nessun utente selezionato',
                        addSelectedUser: 'Aggiungi l’utente selezionato',
                        usersAdded: ' utenti sono stati aggiunti',
                        addFpf: 'Aggiungi FPF',
                        addOrganization: 'Crea organizzazione',
                        createOrganization: 'Crea una nuova organizzazione',
                        public: 'Pubblico',
                        private: 'Privato',
                        yesDelete: 'Sì, elimina',
                        cancel: 'Annulla',
                        confirmDialog: 'Questa azione non può essere annullata. Sei sicuro di voler eliminare questo ciclo di crescita?',
                        members: 'Membri',
                        isActive: 'Attivo',
                        actions: 'Azioni',
                        addSensor: 'Aggiungi sensore',
                        table: {
                            name: 'Nome',
                            planted: 'Pianta il',
                            harvested: 'Raccolto il',
                            notes: 'Annotazioni'
                        }
                    },
                    growingCycleForm: {
                        plantTypeLabel: 'Tipo di pianta',
                        plantTypePlaceholder: 'Inserisci il tipo di pianta',
                        startDateLabel: 'Data di inizio',
                        startDatePlaceholder: 'Seleziona la data di inizio',
                        endDateLabel: 'Data di fine',
                        endDatePlaceholder: 'Seleziona la data di fine',
                        notesLabel: 'Note',
                        notesPlaceholder: 'Inserisci le note',
                        saveButton: 'Salva',
                    },
                    button: {
                        loginToManage: 'Accedi per gestire l’organizzazione',
                        create: 'Crea',
                        add: 'Aggiungi'
                    },
                    label: {
                        organizationName: 'Nome dell’organizzazione',
                        setPublic: 'Imposta come pubblico'
                    },
                    placeholder: {
                        enterOrganizationName: 'Inserisci il nome dell’organizzazione'
                    },
                    error: {
                        organizationNameTaken: 'Il nome dell’organizzazione è già preso'
                    },
                    userprofile: {
                        notifications: {
                            success: {
                                title: 'Aggiornamento riuscito',
                                message: 'Nome del profilo aggiornato con successo!',
                            },
                            error: {
                                title: 'Impossibile aggiornare il nome del profilo',
                            }
                        },
                        enterName: 'Inserisci il tuo nome visualizzato',
                        saveChanges: 'Salva le modifiche',
                    },
                    camera: {
                        location: 'Posizione',
                        enterLocation: 'Inserisci la posizione',
                        modelNr: 'Numero di modello',
                        enterModelNr: 'Inserisci il numero di modello',
                        intervalSeconds: 'Intervallo in secondi',
                        enterIntervalSeconds: 'Inserisci l’intervallo in secondi',
                        resolution: 'Risoluzione',
                        enterResolution: 'Inserisci la risoluzione',
                        livestreamUrl: 'URL del livestream',
                        enterLivestreamUrl: 'Inserisci l’URL del livestream',
                        snapshotUrl: 'URL dello snapshot',
                        enterSnapshotUrl: 'Inserisci l’URL dello snapshot',
                        addCamera: 'Aggiungi fotocamera',
                        editCamera: 'Modifica fotocamera',
                        createCamera: 'Crea fotocamera',
                    }
                },
            },
            zh: {
                translation: {
                    header: {
                        title: 'FARMINSIGHT',
                        organizations: '组织',
                        myOrganizations: '我的组织',
                        loginToManage: '登录以管理组织',
                        loginToSee: '登录查看您的组织',
                        login: '登录',
                        logout: '退出登录',
                        search: '搜索 FPF...',
                        kick: '移除',
                        promote: '提升',
                        email: '电子邮箱',
                        name: '名称',
                        address: '地址',
                        enterAddress: '输入地址',
                        location: '位置',
                        enterLocation: '输入位置',
                        enterName: '输入名称',
                        role: '角色',
                        organization: '组织',
                        searchUserProfile: '搜索用户资料',
                        noProfilesFound: '未找到任何资料',
                        addUser: '添加用户',
                        noUserSelected: '未选择用户',
                        addSelectedUser: '添加选定用户',
                        usersAdded: ' 位用户已添加',
                        addFpf: '添加 FPF',
                        addOrganization: '创建组织',
                        createOrganization: '创建新组织',
                        public: '公开',
                        private: '私人',
                        yesDelete: '是的，删除',
                        cancel: '取消',
                        confirmDialog: '此操作无法撤销。您确定要删除此种植周期吗？',
                        members: '成员',
                        isActive: '活跃',
                        actions: '操作',
                        addSensor: '添加传感器',
                        table: {
                            name: '名称',
                            planted: '种植时间',
                            harvested: '收获时间',
                            notes: '备注'
                        }
                    },
                    growingCycleForm: {
                        plantTypeLabel: '植物类型',
                        plantTypePlaceholder: '输入植物类型',
                        startDateLabel: '开始日期',
                        startDatePlaceholder: '选择开始日期',
                        endDateLabel: '结束日期',
                        endDatePlaceholder: '选择结束日期',
                        notesLabel: '备注',
                        notesPlaceholder: '输入备注',
                        saveButton: '保存',
                    },
                    button: {
                        loginToManage: '登录以管理组织',
                        create: '创建',
                        add: '添加'
                    },
                    label: {
                        organizationName: '组织名称',
                        setPublic: '设置公开'
                    },
                    placeholder: {
                        enterOrganizationName: '输入组织名称'
                    },
                    error: {
                        organizationNameTaken: '组织名称已被占用'
                    },
                    userprofile: {
                        notifications: {
                            success: {
                                title: '更新成功',
                                message: '成功更新了个人资料名称！',
                            },
                            error: {
                                title: '无法更新个人资料名称',
                            }
                        },
                        enterName: '输入您的显示名称',
                        saveChanges: '保存更改',
                    },
                    camera: {
                        location: '位置',
                        enterLocation: '输入位置',
                        modelNr: '型号',
                        enterModelNr: '输入型号',
                        intervalSeconds: '间隔时间（秒）',
                        enterIntervalSeconds: '输入间隔时间（秒）',
                        resolution: '分辨率',
                        enterResolution: '输入分辨率',
                        livestreamUrl: '直播流 URL',
                        enterLivestreamUrl: '输入直播流 URL',
                        snapshotUrl: '快照 URL',
                        enterSnapshotUrl: '输入快照 URL',
                        addCamera: '添加摄像头',
                        editCamera: '编辑摄像头',
                        createCamera: '创建摄像头',
                    }
                },
            },
            ru: {
                translation: {
                    header: {
                        title: 'FARMINSIGHT',
                        organizations: 'Организации',
                        myOrganizations: 'Мои организации',
                        loginToManage: 'Войти для управления организацией',
                        loginToSee: 'Войдите, чтобы увидеть ваши организации',
                        login: 'Войти',
                        logout: 'Выйти',
                        search: 'Искать FPF...',
                        kick: 'Удалить',
                        promote: 'Повысить',
                        email: 'Электронная почта',
                        name: 'Имя',
                        address: 'Адрес',
                        enterAddress: 'Введите адрес',
                        enterName: 'Введите имя',
                        location: 'Местоположение',
                        enterLocation: 'Введите местоположение',
                        role: 'Роль',
                        organization: 'Организация',
                        searchUserProfile: 'Поиск профиля пользователя',
                        noProfilesFound: 'Профили не найдены',
                        addUser: 'Добавить пользователя',
                        noUserSelected: 'Пользователь не выбран',
                        addSelectedUser: 'Добавить выбранного пользователя',
                        usersAdded: ' пользователей было добавлено',
                        addFpf: 'Добавить FPF',
                        addOrganization: 'Создать организацию',
                        createOrganization: 'Создать новую организацию',
                        public: 'Общедоступный',
                        private: 'Приватный',
                        yesDelete: 'Да, удалить',
                        cancel: 'Отмена',
                        confirmDialog: 'Это действие нельзя отменить. Вы уверены, что хотите удалить этот цикл роста?',
                        members: 'Участники',
                        isActive: 'Активный',
                        actions: 'Действия',
                        addSensor: 'Добавить датчик',
                        table: {
                            name: 'Имя',
                            planted: 'Дата посадки',
                            harvested: 'Дата сбора',
                            notes: 'Примечания'
                        }
                    },
                    growingCycleForm: {
                        plantTypeLabel: 'Тип растения',
                        plantTypePlaceholder: 'Введите тип растения',
                        startDateLabel: 'Дата начала',
                        startDatePlaceholder: 'Выберите дату начала',
                        endDateLabel: 'Дата окончания',
                        endDatePlaceholder: 'Выберите дату окончания',
                        notesLabel: 'Примечания',
                        notesPlaceholder: 'Введите примечания',
                        saveButton: 'Сохранить',
                    },
                    button: {
                        loginToManage: 'Войти для управления организацией',
                        create: 'Создать',
                        add: 'Добавить'
                    },
                    label: {
                        organizationName: 'Название организации',
                        setPublic: 'Установить как публичное'
                    },
                    placeholder: {
                        enterOrganizationName: 'Введите название организации'
                    },
                    error: {
                        organizationNameTaken: 'Название организации уже занято'
                    },
                    userprofile: {
                        notifications: {
                            success: {
                                title: 'Успешно обновлено',
                                message: 'Имя профиля успешно обновлено!',
                            },
                            error: {
                                title: 'Не удалось обновить имя профиля',
                            }
                        },
                        enterName: 'Введите ваше отображаемое имя',
                        saveChanges: 'Сохранить изменения',
                    },
                    camera: {
                        location: 'Местоположение',
                        enterLocation: 'Введите местоположение',
                        modelNr: 'Номер модели',
                        enterModelNr: 'Введите номер модели',
                        intervalSeconds: 'Интервал (в секундах)',
                        enterIntervalSeconds: 'Введите интервал (в секундах)',
                        resolution: 'Разрешение',
                        enterResolution: 'Введите разрешение',
                        livestreamUrl: 'URL прямой трансляции',
                        enterLivestreamUrl: 'Введите URL прямой трансляции',
                        snapshotUrl: 'URL снимка',
                        enterSnapshotUrl: 'Введите URL снимка',
                        addCamera: 'Добавить камеру',
                        editCamera: 'Редактировать камеру',
                        createCamera: 'Создать камеру',
                    }
                },
            },
        },
        lng: navigator.language.split('-')[0],
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;