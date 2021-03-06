import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { CommonService } from './../../common.service';
import { CheckloginService } from './../../checklogin.service';
import { MessageService } from './../../message.service';

declare var $: any;
declare var jQuery: any;
declare var swal: any;

@Component({
	selector: 'app-fitness-challenge-loop',
	templateUrl: './fitness-challenge-loop.component.html',
	styleUrls: []
})
export class FitnessChallengeLoopComponent implements OnInit 
{
	public form = {
      'value': {
        'id':''
      }
  	};
	fitnessloopData = '';
	rdata = [];
	is_error = false;
	error_message =  '';
	success_message = '';
	is_success = false;
	id = '';
	constructor(private commonService: CommonService, private checkloginService: CheckloginService, private router: Router) 
	{ 
		this.commonService.isAuthorizedRoute(); 
		this.commonService.getData('fetchAllFitnessChallengeloops').subscribe(res =>
		{
			this.rdata = JSON.parse(res);
			this.fitnessloopData = this.rdata['data'];
		},
		error => {
			this.rdata = JSON.parse(error._body);
			this.is_error = true;
			this.is_success = false;
			this.error_message = this.rdata['message'];
		}
		);
	}

	ngOnInit() 
	{
		$(function()
		{
	      $(document).on('click', '.alert-close', function() {
	        $('.alert-close').hide();
	      });

	      setTimeout(() => {
	        $('#fitnessDatatable').DataTable({
	          responsive: true
	        });
	      },1000);

	    });
	}
	deleteFitnessLoop(id)
	{
		var self = this;

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
		function(isConfirm)
		{
			if (isConfirm)
			{
				self.form.value.id = id;
				self.commonService.postData(self.form.value,'deleteFitnessChallengeLoop').subscribe(res =>
				{
					self.rdata = JSON.parse(res);
					self.fitnessloopData = self.rdata['data'];
					self.is_success = true;
					self.is_error = false;
					var table = $('#fitnessDatatable').DataTable();
					table.destroy();
					setTimeout(() => {
						$('#fitnessDatatable').DataTable({
							responsive: true
						});
					},1000);
					self.success_message = self.rdata['message'];
				},
				error => {
					self.rdata = JSON.parse(error._body);
					self.is_error = true;
					self.is_success = false;
					self.error_message = self.rdata['message'];
				}
				);
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

}
