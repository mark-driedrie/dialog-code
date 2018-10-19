@extends('layouts.blank')

@section('main_container')
<!-- page title -->
@include( "title" , array('title' => 'Issue Overzicht', 'subtitle' => 'Rapportages'))

<div class="row">
<div class="col-md-4 ">
  <div class="text-left box-shadow panel col-md-12" >

   <h4>Specifieke Issue</h4>
   <br>

    <form class="form-horizontal">
      <div class="form-group">
        <label for="date" class="col-sm-2 control-label">Issue</label>
        <div class="col-sm-10">
          <select class="form-control">
            <option>Issue 1</option>
            <option>Issue 2</option>
            <option>Issue 3</option>
          </select>
        </div>
      </div>
        <div class="form-group">
        <label for="code" class="col-sm-2 control-label"></label>
        <div class="col-sm-10">
          <button type="submit" class="btn btn-default right">Download</button>
        </div>
      </div>
    </form>
  </div>
</div>

<div class="col-md-4">
  <div class="text-left box-shadow panel col-md-12" >

   <h4>Meerdere Issue</h4>
   <br>

    <form class="form-horizontal">
      <div class="form-group">
        <label for="date" class="col-sm-2 control-label">Issue</label>
        <div class="col-sm-10">
          <div class="form-check">
              <label class="form-check-label">
                <input class="form-check-input" type="checkbox" value="">
                Open
              </label>
            </div>
            <div class="form-check">
              <label class="form-check-label">
                <input class="form-check-input" type="checkbox" value="">
                Gesloten
              </label>
            </div>
            <div class="form-check">
              <label class="form-check-label">
                <input class="form-check-input" type="checkbox" value="">
                Urgent
              </label>
            </div>

        </div>
      </div>
        <div class="form-group">
        <label for="code" class="col-sm-2 control-label"></label>
        <div class="col-sm-10">
          <button type="submit" class="btn btn-default right">Download</button>
        </div>
      </div>
    </form>
  </div>
</div>

<div class="col-md-4">
<div class="text-left box-shadow panel col-md-12" >

   <h4>Volledige Status Rapportage</h4>
   <br>

    <form class="form-horizontal">
      <div class="form-group">
        <label for="date-start" class="col-sm-2 control-label">Vanaf data</label>
        <div class="col-sm-10">
          <input type="date" name="date-start">
        </div>
      </div>
      <div class="form-group">
        <label for="date-end" class="col-sm-2 control-label">Tot data</label>
        <div class="col-sm-10">
          <input type="date" name="date-end">
        </div>
      </div>
        <div class="form-group">
        <label for="code" class="col-sm-2 control-label"></label>
        <div class="col-sm-10">
          <button type="submit" class="btn btn-default right">Download</button>
        </div>
      </div>
    </form>
  </div>
</div>
</div>
@endsection
