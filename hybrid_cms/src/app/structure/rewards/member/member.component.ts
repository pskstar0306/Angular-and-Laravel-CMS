import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { CommonService } from './../../../common.service';
import { Observable } from 'rxjs/Observable';

import { Angular2Csv } from 'angular2-csv/Angular2-csv';

declare var $: any;
declare var jQuery: any;
declare var swal: any;
declare var NProgress: any;

@Component({
    selector: 'app-member',
    templateUrl: './member.component.html',
    styleUrls: []
})
export class MemberComponent implements OnInit { 
	public form = {
		'value': {
		  'id': ''
		}
	}; 

	rdata = [];
	members: any[];
	is_error = false;
	error_message = '';
	success_message = '';
	is_success = false;
	appId: string;

	handleTimer: Observable<any>;

	constructor(private commonService: CommonService) {
		this.commonService.isAuthorizedRoute();
		this.handleTimer = Observable.timer(1000);
	}

	initDatatable(): void {
		const handleDelay = Observable.timer(100);
		handleDelay.subscribe(() => {
			$('#membersDatatable').DataTable({ responsive: true });
		})
	}

	export() {
		new Angular2Csv(this.members, 'export_members_' + Date() + '.csv'); 
	}

	getMembers() {
		this.handleTimer.subscribe(() => {
			NProgress.start();
		});
		this.commonService.postData({'app_id': this.appId}, 'fetchAllMembers').subscribe(res => {
				this.members = JSON.parse(res)['data'];
				this.members.map(member => member.name = (member.first_name ? member.first_name + ' ' : '') + (member.last_name ? member.last_name : ''));
				this.handleTimer.subscribe(() => {
					NProgress.done();
				});
				this.initDatatable();
			}, error => {
				this.rdata = JSON.parse(error._body);
		        this.is_error = true;
		        this.is_success = false;
		        this.error_message = this.rdata['message'];
		        this.handleTimer.subscribe(() => {
		          NProgress.done();
		        });
			});
	}

	ngOnInit() {
		this.appId = JSON.stringify(this.commonService.get_current_app_data().id);
		$("#mySidenav").css('display','none');
		this.commonService.isAuthorizedRoute();

		$(function () {
		  // Handle error message
		  $(document).on('click', '.alert-close', function () {
		    $('.alert-close').hide();
		  });
		});

		if (this.commonService.isMessage()) {
		  const success_message = this.commonService.getMessage();
		  $(function () {
		    $.notify({
		      title: '',
		      message: success_message
		    }, {
		        type: 'success'
		      });
		  });
		  this.commonService.removeMessage();
		}
		this.getMembers();
	}

	deleteMember(id) {
		this.form.value.id = id;
	    const self = this;

	    swal({
	      title: "Are you sure?",
	      text: "You will not be able to recover this record",
	      type: "warning",
	      showCancelButton: true,
	      confirmButtonClass: "btn-danger",
	      confirmButtonText: "Yes, remove it",
	      cancelButtonText: "Cancel",
	      closeOnConfirm: false,
	      closeOnCancel: true
	    },
	      function (isConfirm) {
	        if (isConfirm) {
	          self.deleteMemberData(id);
	          swal({
	            title: "Deleted!",
	            text: "Your record has been deleted.",
	            type: "success",
	            confirmButtonClass: "btn-success"
	          });
	        } else {
	          swal({
	            title: "Cancelled",
	            text: "Your record is safe :)",
	            type: "error",
	            confirmButtonClass: "btn-danger"
	          });
	        }
	      });
	}

	deleteMemberData(id) {
		this.commonService.postData({'app_id': this.appId, 'id': id}, 'deleteMember').subscribe(res => {
		  	this.members = JSON.parse(res)['data'];
			this.members.map(member => member.name = (member.first_name ? member.first_name : '') + (member.last_name ? member.last_name : ''));
			this.is_success = true;
			this.is_error = false;
			const table = $('#membersDatatable').DataTable();
			table.destroy();
			setTimeout(() => {
				$('#membersDatatable').DataTable({
				  responsive: true
				});
			}, 1000);
			this.success_message = this.rdata['message'];
		},
		  error => {
		    this.rdata = JSON.parse(error._body);
		    this.is_error = true;
		    this.is_success = false;
		    this.error_message = this.rdata['message'];
		  }
		);
	}


}
