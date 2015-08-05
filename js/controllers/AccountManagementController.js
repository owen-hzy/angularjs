'use strict';

MetronicApp.controller('AccountManagementController', function($scope, $modal, HttpService, uiGridConstants, users) {
    	// Load Users

	if (users.errorMessage || users.Message) {
		$scope.errorMessage = 'Failed to load users, please refresh or contact administrator';
		return;
	} else {
		delete $scope.errorMessage;
	}

	$scope.gridOptions = {
		enableRowSelection: true,
		enableRowHeaderSelection: false,
		columnDefs: [
			{ name: 'LearnerId', displayName: 'UserId' },
			{ name: 'Username' },
			{ name: 'Roles', displayName: 'UserRoles' }
		],
		enableHorizontalScrollbar: uiGridConstants.scrollbars.NEVER,
		enableVerticalScrollbar: uiGridConstants.scrollbars.NEVER,
		multiSelect: false,
		onRegisterApi: function(gridApi) {
			$scope.gridApi = gridApi;

			gridApi.selection.on.rowSelectionChanged($scope, function(row) {
				$scope.isRowSelected = row.isSelected;
				$scope.selectedRow = row;
			})
		}
	};

	$scope.gridOptions.data = users;

	$scope.userRoles = ["Administrator", "ModuleOwner"];

	$scope.remove = function() {
		if ($scope.isRowSelected) {
			delete $scope.requestError;
			$scope.modal = $modal.open({
				templateUrl: 'views/deleteConfirm.html',
				scope: $scope
			});
		}
	};

	$scope.add = function() {
		delete $scope.requestError;
		$scope.newUser = {};
		$scope.modal = $modal.open({
			templateUrl: 'views/addUserModal.html',
			scope: $scope
		});
	}

	$scope.edit = function() {
		if ($scope.isRowSelected) {
			delete $scope.requestError;
			$scope.editUser = {};
			angular.copy($scope.selectedRow.entity, $scope.editUser);
			$scope.modal = $modal.open({
				templateUrl: 'views/editUserModal.html',
				scope: $scope
			});
		}
	}

	$scope.updateUser = function() {
		delete $scope.requestError;
		if ($scope.isRowSelected) {
			HttpService.sendRequest('/WebApi/api/protected/users', 'PUT', 10000, true, $scope.editUser).then(function(response){
				$scope.selectedRow.entity.LearnerId = $scope.editUser.LearnerId;
				$scope.selectedRow.entity.Username = $scope.editUser.Username;
				$scope.selectedRow.entity.Roles = $scope.editUser.Roles;
				$scope.modal.close();
			}, function(error) {
				$scope.requestError = error.errorMessage || error.Message;
			});
		}
	}

	$scope.createUser = function() {
		delete $scope.requestError;
		var newUser = {
			"LearnerId": $scope.newUser.userId,
			"Username": $scope.newUser.username,
			"Password": $scope.newUser.password,
			"Roles": $scope.newUser.roles
		}
		HttpService.sendRequest('/WebApi/api/protected/users', 'POST', 10000, true, newUser).then(function(response){
			$scope.gridOptions.data.push(newUser);
			$scope.modal.close();
		}, function(error) {
			$scope.requestError = error.errorMessage || error.Message;
		});
	}

	$scope.deleteUser = function(confirmed) {
		delete $scope.requestError;
		if (confirmed) {
			if ($scope.isRowSelected) {
				HttpService.sendRequest('/WebApi/api/protected/users/' + $scope.selectedRow.entity.LearnerId,
					'DELETE', 10000, true).then(function(response) {
						$scope.gridOptions.data.splice($scope.gridOptions.data.lastIndexOf($scope.selectedRow.entity), 1);
						$scope.modal.close();
                        delete $scope.isRowSelected;
                        $scope.gridApi.selection.clearSelectedRows();
					}, function(error) {
						$scope.requestError = error.errorMessage || error.Message;
					});
			}
		}
		else {
			$scope.modal.dismiss();
			$scope.gridApi.selection.clearSelectedRows();
			$scope.isRowSelected = false;
		}
	}

});