'use strict';

MetronicApp.controller('UsersManagementController', function($scope, $modal, HttpService, uiGridConstants) {
    	// Load Users
	HttpService.sendRequest('/api/protected/users', 'GET', 2000, true).then(function(response) {
		delete $scope.loadMessage;
		$scope.gridOptions.data = response;
	}, function(error) {
		$scope.loadMessage = error.errorMessage || error.Message;
	});

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
			HttpService.sendRequest('/api/protected/users', 'PUT', 2000, true, $scope.editUser).then(function(response){
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
		HttpService.sendRequest('/api/protected/users', 'POST', 2000, true, newUser).then(function(response){
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
				console.log($scope.selectedRow.entity.LearnerId);
				HttpService.sendRequest('/api/protected/users/' + $scope.selectedRow.entity.LearnerId, 
					'DELETE', 2000, true).then(function(response) {
						$scope.gridOptions.data.splice($scope.gridOptions.data.lastIndexOf($scope.selectedRow), 1);
						$scope.modal.close();
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