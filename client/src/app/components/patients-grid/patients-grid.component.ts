import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  GridComponent, 
  GridModule, 
  ToolbarService, 
  EditService, 
  PageService, 
  SortService, 
  FilterService,
  EditSettingsModel,
  ToolbarItems
} from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor, WebApiAdaptor } from '@syncfusion/ej2-data';

/**
 * Interface for Patient data structure
 */
export interface Patient {
  PatientID: number;
  FirstName: string;
  LastName: string;
  DateOfBirth: string;
  Gender: string;
  BloodGroup: string;
  ContactNumber: string;
  Email: string;
  Address: string;
  AdmissionDate: string;
  Department: string;
  AttendingPhysician: string;
  Status: string;
}

/**
 * Patients Grid Component
 * Displays hospital patient management data using Syncfusion EJ2 DataGrid
 * Features: Remote data binding, CRUD operations, sorting, filtering, paging
 */
@Component({
  selector: 'app-patients-grid',
  standalone: true,
  imports: [CommonModule, GridModule],
  providers: [ToolbarService, EditService, PageService, SortService, FilterService],
  templateUrl: './patients-grid.component.html',
  styleUrls: ['./patients-grid.component.scss']
})
export class PatientsGridComponent implements OnInit {
  @ViewChild('grid') public grid!: GridComponent;

  /**
   * DataManager configured with UrlAdaptor for remote CRUD operations
   */
  public dataManager!: DataManager;

  /**
   * Edit settings for the grid
   */
  public editSettings: EditSettingsModel = {
    allowEditing: true,
    allowAdding: true,
    allowDeleting: true,
    mode: 'Normal'
  };

  /**
   * Toolbar configuration
   */
  public toolbar: ToolbarItems[] = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search'];

  /**
   * Page settings
   */
  public pageSettings = { pageSize: 10, pageCount: 5 };

  /**
   * Filter settings
   */
  public filterSettings = { type: 'Excel' };

  /**
   * Blood group dropdown options
   */
  public bloodGroupParams = {
    params: {
      dataSource: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      fields: { text: 'value', value: 'value' }
    }
  };

  /**
   * Gender dropdown options
   */
  public genderParams = {
    params: {
      dataSource: ['Male', 'Female', 'Other'],
      fields: { text: 'value', value: 'value' }
    }
  };

  /**
   * Department dropdown options
   */
  public departmentParams = {
    params: {
      dataSource: [
        'Cardiology',
        'Neurology',
        'Orthopedics',
        'Pediatrics',
        'Emergency',
        'Oncology',
        'Dermatology',
        'General Surgery',
        'Gynecology',
        'Psychiatry'
      ],
      fields: { text: 'value', value: 'value' }
    }
  };

  /**
   * Status dropdown options
   */
  public statusParams = {
    params: {
      dataSource: ['In Treatment', 'Discharged', 'Critical', 'Recovering', 'Scheduled'],
      fields: { text: 'value', value: 'value' }
    }
  };

  /**
   * Validation rules for form fields
   */
  public validationRules = {
    required: true
  };

  public emailValidationRules = {
    required: true,
    email: true
  };

  ngOnInit(): void {
    /**
     * Initialize DataManager with UrlAdaptor
     * This automatically handles:
     * - GET requests with skip/take for pagination
     * - Sorting and filtering parameters
     * - POST for insert
     * - PUT for update
     * - DELETE for delete
     */
    this.dataManager = new DataManager({
      url: 'http://localhost:3000/api/patients',
      insertUrl: 'http://localhost:3000/api/patients',
      updateUrl: 'http://localhost:3000/api/patients',
      removeUrl: 'http://localhost:3000/api/patients',
      adaptor: new UrlAdaptor(),
      crossDomain: true
    });
  }

  /**
   * Event handler for action complete
   * Shows success message
   */
  public actionComplete(args: any): void {
    if (args.requestType === 'save') {
      console.log('Patient saved successfully');
    } else if (args.requestType === 'delete') {
      console.log('Patient deleted successfully');
    }
  }

  /**
   * Event handler for action failure
   * Shows error message
   */
  public actionFailure(args: any): void {
    console.error('Action failed:', args);
    alert('Operation failed. Please check the console for details.');
  }
}
